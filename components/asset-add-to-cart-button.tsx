'use client'

import { LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { ExploreAsset } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ComponentProps, FC, MouseEvent, useTransition } from 'react'
import { Skeleton } from './ui/skeleton'

interface Props
  extends Pick<ExploreAsset, 'id' | 'title' | 'basePrice' | 'featuredImage'>,
    Pick<
      ComponentProps<typeof LoadingButton>,
      'variant' | 'className' | 'size'
    > {
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
  size,
  ...props
}) => {
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart, removeItem, cart, isLoading } = useCart()
  const [isPending, startTransition] = useTransition()
  const isItemInCart = cart.some((item) => item.assetId === id)

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to add items to your cart',
      })

      router.push(
        `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }

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
        <Skeleton className='h-10 w-full rounded-full' />
      ) : (
        <LoadingButton
          onClick={handleAddToCart}
          isLoading={isLoading || isPending}
          disabled={isLoading || isPending}
          size={size}
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
