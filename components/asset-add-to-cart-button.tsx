'use client'

import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { LICENSE_TYPE, ROUTES } from '@/lib/constants'
import { ExploreAsset } from '@/lib/types'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ComponentProps, FC } from 'react'
import { LoadingButton } from './ui/button'
import { toast } from './ui/toast'

interface Props
  extends Omit<ComponentProps<typeof LoadingButton>, 'id' | 'title'>,
    Pick<ExploreAsset, 'id' | 'title' | 'price' | 'featuredImage'> {}

export const AssetAddToCartButton: FC<Props> = ({
  id,
  price,
  title,
  featuredImage,
  variant = 'default',
  ...rest
}) => {
  const router = useRouter()
  const { user } = useAuth()
  const { addItem, items } = useCart()

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to purchase this asset.',
      })

      router.push(
        `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }

    addItem({
      assetId: id,
      assetLicenseId: LICENSE_TYPE.STANDARD,
      title: title,
      price: price,
      licenseName: 'Standard License',
      image: featuredImage,
    })
  }

  const isDisabled = items.some((item) => item.assetId === id)

  return (
    <LoadingButton
      variant={variant}
      onClick={handleAddToCart}
      size='sm'
      disabled={isDisabled}
      {...rest}
    >
      <ShoppingCart className='mr-2 h-5 w-5' />
      {isDisabled ? 'Added to cart' : 'Add to Cart'}
    </LoadingButton>
  )
}
