'use client'

import { addOrRemoveFavorite } from '@/actions/favorite'
import { useAuth } from '@/hooks/use-auth'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState, useTransition } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { toast } from './ui/toast'

interface Props {
  assetId: string
}

export const FavoriteButton: FC<Props> = ({ assetId }) => {
  const { user, isPending: isLoadingUser } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [isLoading, setIsLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const response = await fetch(
          `${API_ROUTES.favorites()}?assetId=${assetId}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch favorite status')
        }

        const data = await response.json()

        // Update the server state
        setIsFavorited(!!data)
      } catch (error) {
        console.error('Error fetching favorite status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) fetchFavorite()
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

    startTransition(async () => {
      const { data, error } = await addOrRemoveFavorite(assetId)

      if (error) {
        toast.error('Error', {
          description: 'Failed to update favorites. Please try again.',
        })

        return
      }

      startTransition(() => {
        setIsFavorited(!!data?.favorited)
      })

      toast.success(
        data?.favorited ? 'Added to favorites' : 'Removed from favorites',
        {
          description: data?.favorited
            ? 'This asset has been added to your favorites'
            : 'This asset has been removed from your favorites',
        },
      )
    })
  }

  if (!isLoadingUser && !user) return null

  return (
    <>
      {isLoading || isLoadingUser ? (
        <Skeleton className='w-10 h-10 rounded-full' />
      ) : (
        <Button
          variant='outline'
          size='icon'
          onClick={handleClick}
          disabled={isPending}
          aria-label={
            isFavorited ? 'Remove from favorites' : 'Add to favorites'
          }
          className={cn(
            'w-6 h-6 md:h-10 md:w-10 group hover:text-[#FF385C] bg-white rounded-full',
            isFavorited && 'text-[#FF385C]',
          )}
        >
          <Heart
            className={cn(
              'w-4 h-4 text-black group-hover:fill-[#FF385C] group-hover:text-[#FF385C]',
              isFavorited && 'fill-current text-[#FF385C]',
            )}
          />
          <span className='sr-only'>Favorite button</span>
        </Button>
      )}
    </>
  )
}
