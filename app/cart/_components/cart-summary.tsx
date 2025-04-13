'use client'

import { PaymentPriceSection } from '@/app/checkout/_components/payment-price-section'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { ROUTES } from '@/lib/constants'
import { CartItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

interface Props {
  cartItems: CartItem[]
  cartTotal: number
}

export const CartSummary: FC<Props> = ({ cartItems, cartTotal }) => {
  const router = useRouter()
  const { clearCart, isLoading } = useCart()

  return (
    <Card className='lg:col-span-1 h-fit'>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <PaymentPriceSection cartTotal={cartTotal} />
      </CardContent>

      <CardFooter className='flex flex-col gap-2'>
        <Button
          className='w-full'
          size='lg'
          disabled={isLoading || !cartItems.length}
          onClick={() => router.push(ROUTES.checkout())}
        >
          Proceed to Checkout
        </Button>

        <Button
          variant='outline'
          className='w-full'
          disabled={isLoading || !cartItems.length}
          onClick={() => clearCart()}
        >
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
