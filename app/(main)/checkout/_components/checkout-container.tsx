'use client'

import { CartItemList } from '@/app/(main)/cart/_components/cart-item-list'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBeforePageUnload } from '@/hooks/use-before-page-unload'
import { ROUTES } from '@/lib/constants'
import { CartItem } from '@/lib/types'
import Link from 'next/link'
import { FC, useState } from 'react'
import { CheckoutCodeContainer } from './checkout-code-container'
import { PaymentPriceSection } from './payment-price-section'
import { PaypalButtons } from './paypal-buttons'

interface Props {
  cartTotal: number
  cartItems: CartItem[]
}

export const CheckoutContainer: FC<Props> = ({ cartItems, cartTotal }) => {
  const [isPurchasing, setIsPurchasing] = useState(false)
  useBeforePageUnload(isPurchasing)

  return (
    <>
      {/* Cart Summary Section */}
      <CartItemList cartItems={cartItems} showActions={false} />

      {/* Payment Section */}
      <div className='flex flex-col gap-4'>
        <Card className='min-h-[407px]'>
          <CardHeader>
            <CardTitle>Complete Payment</CardTitle>
            <CardDescription>
              Secure payment processing by PayPal
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4 flex-1'>
            <PaymentPriceSection cartTotal={cartTotal} />

            <CheckoutCodeContainer />

            <Separator />

            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground mt-2'>
                <strong>Important:</strong> All digital assets are final sale
                and non-refundable once accessed or downloaded. By completing
                this purchase, you agree to our{' '}
                <Link href={ROUTES.terms()} className='underline'>
                  Terms of Service
                </Link>
                .
              </p>

              <PaypalButtons
                isPurchasing={isPurchasing}
                setIsPurchasing={setIsPurchasing}
                cartTotal={cartTotal}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
