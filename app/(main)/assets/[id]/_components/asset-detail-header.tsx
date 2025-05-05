import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Prisma } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { FC } from 'react'

type Props = Prisma.AssetGetPayload<{
  include: {
    category: {
      select: {
        name: true
      }
    }
    creator: {
      select: {
        user: {
          select: {
            name: true
            image: true
          }
        }
      }
    }
    reviews: true
  }
}>

export const AssetDetailHeader: FC<Props> = ({
  title,
  averageRating,
  sales,
  creator,
  category,
  reviews,
}) => {
  return (
    <div className='mb-4'>
      <h1 className='text-3xl font-bold tracking-tight mb-3'>{title}</h1>

      <div className='flex items-center gap-4 flex-wrap'>
        <div className='flex items-center gap-2'>
          <Avatar
            className='h-8 w-8'
            src={creator.user.image || '/placeholder.svg?height=40&width=40'}
            alt={creator.user.name || 'Creator'}
            fallback={(creator.user.name || 'C').charAt(0)}
          />

          <span className='text-sm'>
            by{' '}
            <span className='font-medium'>
              {creator.user.name || 'Unknown Creator'}
            </span>
          </span>
        </div>

        <div className='flex items-center'>
          <StarIcon className='h-4 w-4 fill-yellow-400 text-yellow-400' />

          <span className='text-sm font-medium'>
            {averageRating.toFixed(1)}
          </span>

          <span className='text-xs text-muted-foreground ml-1'>
            ({reviews.length} reviews)
          </span>
        </div>

        <div className='text-sm text-muted-foreground'>{sales} sales</div>

        <Badge>{category.name}</Badge>
      </div>
    </div>
  )
}
