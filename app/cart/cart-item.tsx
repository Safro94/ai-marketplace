'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { ROUTES } from '@/lib/constants'
import { CartItem as ICartItem } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

export const CartItem: FC<ICartItem & { canEdit?: boolean }> = ({
  assetId,
  assetLicenseId,
  image,
  title,
  licenseName,
  price,
  canEdit = true,
}) => {
  const { removeItem } = useCart()

  return (
    <div
      key={`${assetId}-${assetLicenseId}`}
      className='flex items-center space-x-4'
    >
      <div className='relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0'>
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className='object-cover'
        />
      </div>

      <div className='flex-1 min-w-0'>
        <Link href={ROUTES.assetsDetail(assetId)}>
          <h3 className='font-medium truncate'>{title}</h3>
        </Link>

        <p className='text-sm text-muted-foreground'>{licenseName}</p>
      </div>

      <div className='text-right flex items-center gap-2'>
        <span className='font-medium'>${price.toFixed(2)}</span>

        {canEdit && (
          <Button
            variant='ghost'
            size='sm'
            className='text-red-500'
            onClick={() => removeItem(assetId, title)}
          >
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Remove</span>
          </Button>
        )}
      </div>
    </div>
  )
}
