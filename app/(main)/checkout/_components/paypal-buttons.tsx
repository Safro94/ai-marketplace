'use client'

import { PaypalButtonsSkeleton } from '@/components/skeletons/paypal-buttons-skeleton'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { tryCatch } from '@/lib/actions-error-handling'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { CheckoutCreatorsData, CheckoutPaymentDetails } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  PayPalButtons as PaypalLibButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { useTopLoader } from 'nextjs-toploader'
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react'

interface PaypalButtonsProps {
  isPurchasing: boolean
  setIsPurchasing: Dispatch<SetStateAction<boolean>>
  cartTotal: number
}

interface ButtonsProps extends PaypalButtonsProps {
  isPurchasing: boolean
  setIsPurchasing: Dispatch<SetStateAction<boolean>>
  paypalData: CheckoutPaymentDetails[]
}

export const PaypalButtons: FC<PaypalButtonsProps> = ({
  isPurchasing,
  setIsPurchasing,
  cartTotal,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [creatorsData, setCreatorsData] = useState<CheckoutCreatorsData>()

  useEffect(() => {
    const fetchAssets = async () => {
      const { data: response, error } = await tryCatch(
        fetch(API_ROUTES.assets()),
      )

      if (!response?.ok) {
        setIsLoading(false)
        throw Error('Failed to get creators')
      }

      if (error) {
        toast.error('Error', {
          description: 'There was an error fetching your creators',
        })
      }

      const data: CheckoutCreatorsData = await response?.json()
      setCreatorsData(data)
      setIsLoading(false)
    }

    fetchAssets()
  }, [])

  if (isLoading) return <PaypalButtonsSkeleton />

  return (
    <>
      {creatorsData && !!Object.keys(creatorsData).length && (
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
            merchantId: [
              creatorsData?.PAYPAL?.map(
                (value) => value.accountIdentifier,
              ).join(),
              process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string,
            ],
          }}
        >
          <Buttons
            paypalData={creatorsData.PAYPAL}
            isPurchasing={isPurchasing}
            setIsPurchasing={setIsPurchasing}
            cartTotal={cartTotal}
          />
        </PayPalScriptProvider>
      )}
    </>
  )
}

const Buttons: FC<ButtonsProps> = ({
  paypalData,
  isPurchasing,
  setIsPurchasing,
  cartTotal,
}) => {
  const router = useRouter()
  const { clearCart, affiliateCode, addOrClearAffiliateCode } = useCart()
  const [{ isPending }] = usePayPalScriptReducer()
  const [, startTransition] = useTransition()
  const loader = useTopLoader()

  const isPaypalButtonDisabled = isPending || !cartTotal

  return (
    <PaypalLibButtons
      className={cn(
        '!opacity-100 relative',
        (!cartTotal || isPurchasing) && '!opacity-50 pointer-events-none',
      )}
      disabled={isPaypalButtonDisabled}
      createOrder={async () => {
        setIsPurchasing(true)

        const { data: response, error } = await tryCatch(
          fetch(API_ROUTES.checkout(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paypalData,
            }),
          }),
        )

        if (error || !response) {
          toast.error('Error', {
            description:
              'There was an error creating the order, please try again later or contact support',
          })

          throw Error('Error while creating the order')
        }

        const order = await response.json()
        setIsPurchasing(false)
        return order.id
      }}
      onApprove={async (_data, actions) => {
        loader.start()
        setIsPurchasing(true)

        if (!actions.order) throw Error('Order not found')

        const { data: payment, error } = await tryCatch(
          actions.order?.capture(),
        )

        if (error || !payment) {
          throw Error('Error while capturing the payment')
        }

        const { payer, purchase_units } = payment

        const { data: response, error: createPurchaseError } = await tryCatch(
          fetch(`${API_ROUTES.purchases()}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              affiliateCode,
              paypalOrderId: payment.id,
              paymentDetails: {
                ...payer,
                ...purchase_units,
              },
            }),
          }),
        )

        if (!response?.ok) {
          const data = await response?.json()
          throw new Error(data.error || 'Failed to save purchase')
        }

        if (createPurchaseError) {
          toast.error('Error', {
            description: 'There was an error while saving the purchase',
          })
        }

        toast.success('Successful purchase', {
          description: 'Your items have been purchased successfully.',
        })

        startTransition(() => {
          setIsPurchasing(false)
          loader.done()

          startTransition(async () => {
            await clearCart()
            addOrClearAffiliateCode('')
          })
        })

        router.push(`${ROUTES.checkoutSuccess()}`)
      }}
      onError={() => {
        toast.error('Error', {
          description:
            'There was an error processing your payment, please try again later or contact support',
        })
      }}
    />
  )
}
