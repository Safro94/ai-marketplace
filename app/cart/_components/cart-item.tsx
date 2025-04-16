'use client'

import { LoadingButton } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { ROUTES } from '@/lib/constants'
import { CartItem as CartItemType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useTransition } from 'react'

export const CartItem: FC<{ item: CartItemType }> = ({ item }) => {
  const { removeItem } = useCart()
  const [isPending, startTransition] = useTransition()

  const handleClick = (item: CartItemType) => {
    try {
      startTransition(async () => {
        await removeItem(item.assetId, item.assetLicenseId)
      })

      toast.success('Removed from cart', {
        description: `${item.title} has been removed from your cart.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)

      toast.error('Error', {
        description: 'There was a problem adding this item to your cart.',
      })
    }
  }

  return (
    <Card key={`${item.assetId}-${item.assetLicenseId}`}>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-4 md:items-center sm:flex-row'>
          <div className='relative h-32 w-full md:h-16 md:w-16 rounded-md flex-shrink-0'>
            <Image
              src={item.image || '/placeholder.svg'}
              alt={item.title}
              className='object-cover'
              fill
              priority
            />
          </div>

          <div className='flex-1'>
            <div className='flex justify-between'>
              <div>
                <Link
                  href={ROUTES.assetsDetail(item.assetId)}
                  className='text-lg font-medium hover:underline'
                >
                  {item.title}
                </Link>

                <p className='text-sm text-muted-foreground'>
                  License: {item.licenseName}
                </p>
              </div>

              <div className='text-right flex items-center gap-2'>
                <p className='font-medium'>{formatCurrency(item.price)}</p>

                <LoadingButton
                  variant='ghost'
                  size='sm'
                  className='text-destructive'
                  disabled={isPending}
                  isLoading={isPending}
                  onClick={() => handleClick(item)}
                >
                  <Trash2 className='h-4 w-4' />
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
