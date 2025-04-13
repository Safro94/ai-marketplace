'use client'

import { LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/hooks/use-cart'
import { ExploreAsset } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { ShoppingCart } from 'lucide-react'
import { ComponentProps, FC, useTransition } from 'react'

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
  const { addToCart } = useCart()
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async () => {
    try {
      const price = licensePrice !== undefined ? licensePrice : basePrice

      startTransition(async () => {
        await addToCart({
          assetId: id,
          assetLicenseId: assetLicenseId || LicenseType.STANDARD,
          title,
          price,
          image: featuredImage,
          licenseName: licenseName || 'Standard License',
        })

        toast.success('Added to cart', {
          description: `${title} has been added to your cart.`,
        })
      })
    } catch (error) {
      console.error('Error adding to cart:', error)

      toast.error('Error', {
        description: 'There was a problem adding this item to your cart.',
      })
    }
  }

  return (
    <LoadingButton
      onClick={handleAddToCart}
      isLoading={isPending}
      disabled={isPending}
      {...props}
    >
      <ShoppingCart className='mr-2 h-4 w-4' />
      Add to Cart
    </LoadingButton>
  )
}
