'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/hooks/use-cart'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import {
  CartItem,
  CheckoutCreatorsData,
  CheckoutPaymentDetails,
} from '@/lib/types'
import { cn, tryCatch } from '@/lib/utils'
import {
  PayPalButtons as PaypalLibButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

export const PaypalButtons: FC<{ cartItems: CartItem[] }> = () => {
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

  if (isLoading) return <ButtonsSkeleton />

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
          <Buttons paypalData={creatorsData.PAYPAL} />
        </PayPalScriptProvider>
      )}
    </>
  )
}

const Buttons: FC<{ paypalData: CheckoutPaymentDetails[] }> = ({
  paypalData,
}) => {
  const router = useRouter()
  const { clearCart, cartTotal } = useCart()
  const [{ isPending }] = usePayPalScriptReducer()

  const isPaypalButtonDisabled = isPending || !cartTotal

  return (
    <PaypalLibButtons
      className={cn(
        '!opacity-100',
        !cartTotal && '!opacity-50 pointer-events-none',
      )}
      disabled={isPaypalButtonDisabled}
      createOrder={async () => {
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
        return order.id
      }}
      onApprove={async (_data, actions) => {
        if (!actions.order) throw Error('Order not found')

        const { data: payment, error } = await tryCatch(
          actions.order?.capture(),
        )

        if (error || !payment) {
          throw Error('Error while capturing the payment')
        }

        const { payer, purchase_units } = payment

        const { data: response, error: createPurchaseError } = await tryCatch(
          fetch(`${API_ROUTES.purchase()}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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

        clearCart()
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

const ButtonsSkeleton = () => (
  <div className='flex flex-col items-center'>
    <Skeleton className='w-full h-[45px] mb-3.5' />
    <Skeleton className='w-full h-[45px] mb-3.5' />
    <Skeleton className='w-28 h-3 mb-0.5' />
  </div>
)
