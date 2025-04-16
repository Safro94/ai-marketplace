'use client'

import { PaymentPriceSection } from '@/app/checkout/_components/payment-price-section'
import { Button, LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { ROUTES } from '@/lib/constants'
import { CartItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { FC, useTransition } from 'react'

interface Props {
  cartItems: CartItem[]
  cartTotal: number
}

export const CartSummary: FC<Props> = ({ cartItems, cartTotal }) => {
  const router = useRouter()
  const { clearCart, isLoading } = useCart()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    try {
      startTransition(async () => {
        await clearCart()
      })

      toast.success('Cart cleared', {
        description: `Your cart has been cleared`,
      })
    } catch (error) {
      console.error('Error clearing your cart:', error)

      toast.error('Error', {
        description: 'There was a problem clearing your cart.',
      })
    }
  }

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
          disabled={isLoading || isPending || !cartItems.length}
          onClick={() => router.push(ROUTES.checkout())}
        >
          Proceed to Checkout
        </Button>

        <LoadingButton
          variant='outline'
          className='w-full'
          disabled={isLoading || isPending || !cartItems.length}
          isLoading={isPending}
          onClick={handleClick}
        >
          Clear Cart
        </LoadingButton>
      </CardFooter>
    </Card>
  )
}
