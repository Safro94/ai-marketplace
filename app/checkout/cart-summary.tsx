'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/contexts/cart-context'
import { CartItem } from '../cart/cart-item'

export const CartSummary = () => {
  const { isLoading, items, totalPrice } = useCart()

  return (
    <Card className='w-full flex flex-col flex-1'>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your items before checkout</CardDescription>
      </CardHeader>

      <CardContent className='space-y-4 flex-1'>
        {isLoading && (
          <>
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </>
        )}

        {!isLoading && !items?.length && (
          <div className='text-center py-6'>
            <p className='text-muted-foreground'>Your cart is empty</p>
          </div>
        )}

        {!isLoading && !!items?.length && (
          <div className='space-y-4'>
            {items.map((item) => (
              <CartItem key={item.assetId} {...item} canEdit={false} />
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className='flex justify-between pt-4'>
        <div className='text-base font-semibold'>Total</div>
        <div className='text-base font-semibold'>{totalPrice?.toFixed(2)}</div>
      </CardFooter>
    </Card>
  )
}

const CartItemSkeleton = () => (
  <div className='flex items-center space-x-4'>
    <Skeleton className='w-16 h-16' />

    <div className='flex-1'>
      <Skeleton className='w-full h-5 mb-1' />
      <Skeleton className='w-full h-5' />
    </div>
  </div>
)
