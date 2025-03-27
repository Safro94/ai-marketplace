'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { Favorite } from '@prisma/client'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from './ui/toast'

interface Props {
  assetId: string
  initialFavorited?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const FavoriteButton: FC<Props> = ({
  assetId,
  initialFavorited = false,
  variant = 'outline',
  size = 'icon',
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
        const response = await fetch('/api/favorites')
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

  const toggleFavorite = async () => {
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
      const response = await fetch('/api/favorites', {
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
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={isFavorited ? 'text-red-500 hover:text-red-600' : ''}
    >
      <Heart
        className={`h-[1.2em] w-[1.2em] ${isFavorited ? 'fill-current' : ''}`}
      />
    </Button>
  )
}
