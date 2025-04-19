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
import { CartItem } from '@/lib/types'
import { FC, useState } from 'react'
import { PaymentPriceSection } from './payment-price-section'
import { PaypalButtons } from './paypal-buttons'

interface Props {
  cartTotal: number
  cartItems: CartItem[]
}

export const CheckoutContainer: FC<Props> = ({ cartItems, cartTotal }) => {
  const [isPurchasing, setIsPurchasing] = useState(false)

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

            <Separator />

            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                By completing this purchase, you agree to our Terms of Service
                and Privacy Policy.
              </p>

              <PaypalButtons
                isPurchasing={isPurchasing}
                setIsPurchasing={setIsPurchasing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
