'use client'

import { CartItemSkeleton } from '@/components/cart-item-skeleton'
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
import { formatCurrency } from '@/lib/utils'
import { CartItem } from '../../cart/_components/cart-item'

export const CartSummary = () => {
  const { isLoading, items, totalPrice } = useCart()

  return (
    <Card className='w-full flex flex-col flex-1'>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your items before checkout</CardDescription>
      </CardHeader>

      <CardContent className='space-y-4 flex-1'>
        {isLoading && <CartItemSkeleton />}

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
        <div className='text-base font-semibold'>
          {isLoading ? (
            <Skeleton className='w-10 h-5' />
          ) : (
            formatCurrency(totalPrice)
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
