'use client'

import { Button, LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { CartItem, ExploreAsset } from '@/lib/types'
import { cn } from '@/lib/utils'
import { LicenseType } from '@prisma/client'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  ComponentProps,
  FC,
  MouseEvent,
  useOptimistic,
  useTransition,
} from 'react'
import { Skeleton } from './ui/skeleton'
import { Tooltip } from './ui/tooltip'

interface Props
  extends Pick<
      ExploreAsset,
      'id' | 'title' | 'basePrice' | 'featuredImage' | 'primaryMediaType'
    >,
    Pick<
      ComponentProps<typeof LoadingButton>,
      'variant' | 'className' | 'size'
    > {
  assetLicenseId?: LicenseType
  licenseName?: string
  licensePrice?: number
  showText?: boolean
}

export const AssetAddToCartButton: FC<Props> = ({
  id,
  size,
  title,
  showText,
  basePrice,
  licenseName,
  licensePrice,
  featuredImage,
  assetLicenseId,
  primaryMediaType,
  ...props
}) => {
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart, removeItem, cart, isLoading } = useCart()
  const [, startTransition] = useTransition()

  // Optimistic state for whether the item is in the cart
  const [isItemInCart, optimisticallySetIsItemInCart] = useOptimistic(
    cart.some((item) => item.assetId === id),
    (state, action: { type: 'add' | 'remove' }) => {
      if (action.type === 'add') return true
      if (action.type === 'remove') return false
      return state
    },
  )

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

    const price = licensePrice !== undefined ? licensePrice : basePrice
    const licenseId = assetLicenseId || LicenseType.STANDARD

    if (isItemInCart) {
      // Optimistically update the state to remove the item
      startTransition(async () => {
        optimisticallySetIsItemInCart({ type: 'remove' })

        try {
          await removeItem(id, licenseId)
          toast.success('Removed from cart', {
            description: `${title} has been removed from your cart.`,
          })
        } catch (error) {
          console.error('Error removing from cart:', error)
          toast.error('Error', {
            description:
              'There was a problem removing this item from your cart.',
          })

          // Revert the optimistic update
          startTransition(() => optimisticallySetIsItemInCart({ type: 'add' }))
        }
      })
    } else {
      // Optimistically update the state to add the item
      startTransition(async () => {
        optimisticallySetIsItemInCart({ type: 'add' })

        try {
          const item: CartItem = {
            title,
            price,
            primaryMediaType,
            assetId: id,
            assetLicenseId: licenseId,
            primaryMedia: featuredImage,
            licenseName: licenseName || 'Standard License',
          }

          await addToCart(item)
          toast.success('Added to cart', {
            description: `${title} has been added to your cart.`,
          })
        } catch (error) {
          console.error('Error adding to cart:', error)
          toast.error('Error', {
            description: 'There was a problem adding this item to your cart.',
          })

          // Revert the optimistic update
          startTransition(() =>
            optimisticallySetIsItemInCart({ type: 'remove' }),
          )
        }
      })
    }
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className='h-[30px] w-[30px]' />
      ) : (
        <Tooltip
          content={isItemInCart ? 'Remove from cart' : 'Add to cart'}
          trigger={
            <Button onClick={handleAddToCart} size={size} {...props}>
              {isItemInCart ? (
                <>
                  <Trash2 className={cn('mr-2 h-4 w-4', !showText && 'mr-0')} />
                  {showText && 'Remove from cart'}
                </>
              ) : (
                <>
                  <ShoppingCart
                    className={cn('mr-2 h-4 w-4', !showText && 'mr-0')}
                  />
                  {showText && 'Add to Cart'}
                </>
              )}
            </Button>
          }
        />
      )}
    </>
  )
}
