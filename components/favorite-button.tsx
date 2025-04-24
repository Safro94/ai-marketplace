'use client'

import { addOrRemoveFavorite } from '@/actions/favorite'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { cn, tryCatch } from '@/lib/utils'
import { Favorite } from '@prisma/client'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState, useTransition } from 'react'
import { Button } from './ui/button'
import { toast } from './ui/toast'

interface Props {
  assetId: string
  favorite: Favorite[]
}

export const FavoriteButton: FC<Props> = ({ assetId, favorite }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [isFavorited, setIsFavorited] = useState(!!favorite[0])

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
      const { data, error } = await tryCatch(addOrRemoveFavorite(assetId))

      if (error) {
        console.error('Error toggling favorite:', error)

        toast.error('Error', {
          description: 'Failed to update favorites. Please try again.',
        })

        throw Error('Failed to update favorites. Please try again')
      }

      startTransition(() => {
        setIsFavorited(data.favorited)
      })

      router.refresh()

      toast.success(
        data.favorited ? 'Added to favorites' : 'Removed from favorites',
        {
          description: data.favorited
            ? 'This asset has been added to your favorites'
            : 'This asset has been removed from your favorites',
        },
      )
    })
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'w-6 h-6 md:h-10 md:w-10 group hover:text-[#FF385C] z-10 bg-white rounded-full',
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
  )
}
