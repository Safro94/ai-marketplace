import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Asset, Category, Profile, Review } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { FC } from 'react'

interface Props extends Asset {
  creator: Profile
  category: Category
  reviews: Review[]
}

export const AssetDetailHeader: FC<Props> = ({
  title,
  averageRating,
  sales,
  creator,
  category,
  useCase,
  reviews,
}) => {
  return (
    <div className='mb-4'>
      <h1 className='text-3xl font-bold tracking-tight mb-3'>{title}</h1>

      <div className='flex items-center gap-4 flex-wrap'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={creator.avatarUrl || '/placeholder.svg?height=40&width=40'}
              alt={creator.name || 'Creator'}
            />

            <AvatarFallback>{(creator.name || 'C').charAt(0)}</AvatarFallback>
          </Avatar>

          <span className='text-sm'>
            by{' '}
            <span className='font-medium'>
              {creator.name || 'Unknown Creator'}
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

        <Badge variant='secondary' className='bg-secondary/80 rounded-sm'>
          {category.name}
        </Badge>

        {useCase && <Badge variant='outline'>{useCase}</Badge>}
      </div>
    </div>
  )
}
