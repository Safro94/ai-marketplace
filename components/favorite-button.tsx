'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Favorite } from '@prisma/client'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from './ui/toast'

interface Props extends ButtonProps {
  assetId: string
  initialFavorited?: boolean
  showText?: boolean
}

export const FavoriteButton: FC<Props> = ({
  assetId,
  initialFavorited = false,
  variant = 'ghost',
  size = 'icon',
  className,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Check if asset is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return

      try {
        const response = await fetch(API_ROUTES.favorites())

        if (response.ok) {
          const favorites: Favorite[] = await response.json()
          const isFav = favorites.some((fav) => fav.assetId === assetId)
          setIsFavorited(isFav)
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [assetId, user])

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()

    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to save assets to favorites',
      })

      router.push(
        `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(API_ROUTES.favorites(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle favorite')
      }

      const { favorited } = await response.json()
      setIsFavorited(favorited)

      toast.success(
        favorited ? 'Added to favorites' : 'Removed from favorites',
        {
          description: favorited
            ? 'This asset has been added to your favorites'
            : 'This asset has been removed from your favorites',
        },
      )
    } catch (error) {
      console.error('Error toggling favorite:', error)

      toast.error('Error', {
        description: 'Failed to update favorites. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'group hover:text-[#FF385C] z-10 bg-white rounded-full',
        isFavorited && 'text-[#FF385C]',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-fit w-fit text-black group-hover:fill-[#FF385C] group-hover:text-[#FF385C]',
          isFavorited && 'fill-current text-[#FF385C]',
        )}
      />
    </Button>
  )
}
