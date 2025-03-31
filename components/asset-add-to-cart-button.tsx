'use client'

import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { LICENSE_TYPE, ROUTES } from '@/lib/constants'
import { ExploreAsset } from '@/lib/types'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ComponentProps, FC } from 'react'
import { LoadingButton } from './ui/button'
import { toast } from './ui/toast'

interface Props
  extends Omit<ComponentProps<typeof LoadingButton>, 'id' | 'title'>,
    Pick<ExploreAsset, 'id' | 'title' | 'basePrice' | 'featuredImage'> {}

export const AssetAddToCartButton: FC<Props> = ({
  id,
  basePrice,
  title,
  featuredImage,
  variant = 'default',
  ...rest
}) => {
  const router = useRouter()
  const { user } = useAuth()
  const { addItem, removeItem, items } = useCart()

  const isItemInCart = items.some((item) => item.assetId === id)

  const handleCart = () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to purchase this asset.',
      })

      router.push(
        `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }

    if (isItemInCart) {
      removeItem(id, title)
      return
    }

    addItem({
      assetId: id,
      assetLicenseId: LICENSE_TYPE.STANDARD,
      title: title,
      price: basePrice,
      licenseName: 'Standard License',
      image: featuredImage,
    })
  }

  return (
    <LoadingButton variant={variant} onClick={handleCart} size='sm' {...rest}>
      {isItemInCart ? (
        <Trash2 className='mr-2 h-5 w-5' />
      ) : (
        <ShoppingCart className='mr-2 h-5 w-5' />
      )}

      {isItemInCart ? 'Remove from cart' : 'Add to Cart'}
    </LoadingButton>
  )
}
