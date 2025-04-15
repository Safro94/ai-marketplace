'use client'

import { LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { ExploreAsset } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { ComponentProps, FC, useTransition } from 'react'
import { Skeleton } from './ui/skeleton'

interface Props
  extends Pick<ExploreAsset, 'id' | 'title' | 'basePrice' | 'featuredImage'>,
    Pick<ComponentProps<typeof LoadingButton>, 'variant' | 'className'> {
  assetLicenseId?: LicenseType
  licenseName?: string
  licensePrice?: number
}

export const AssetAddToCartButton: FC<Props> = ({
  id,
  title,
  basePrice,
  featuredImage,
  assetLicenseId,
  licenseName,
  licensePrice,
  ...props
}) => {
  const { addToCart, removeItem, cart, isLoading } = useCart()
  const [isPending, startTransition] = useTransition()
  const isItemInCart = cart.items.some((item) => item.assetId === id)

  const handleAddToCart = async () => {
    try {
      const price = licensePrice !== undefined ? licensePrice : basePrice

      startTransition(async () => {
        const licenseId = assetLicenseId || LicenseType.STANDARD

        if (isItemInCart) {
          await removeItem(id, licenseId)
          toast.success('Removed from cart', {
            description: `${title} has been removed from your cart.`,
          })
        } else {
          await addToCart({
            assetId: id,
            assetLicenseId: licenseId,
            title,
            price,
            image: featuredImage,
            licenseName: licenseName || 'Standard License',
          })
          toast.success('Added to cart', {
            description: `${title} has been added to your cart.`,
          })
        }
      })
    } catch (error) {
      console.error('Error adding to cart:', error)

      toast.error('Error', {
        description: 'There was a problem adding this item to your cart.',
      })
    }
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className='h-10 w-full' />
      ) : (
        <LoadingButton
          onClick={handleAddToCart}
          isLoading={isLoading || isPending}
          disabled={isLoading || isPending}
          {...props}
        >
          {isItemInCart ? (
            <Trash2 className='mr-2 h-5 w-5' />
          ) : (
            <ShoppingCart className='mr-2 h-5 w-5' />
          )}

          {isItemInCart ? 'Remove from cart' : 'Add to Cart'}
        </LoadingButton>
      )}
    </>
  )
}
