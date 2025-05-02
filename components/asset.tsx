import { ROUTES } from '@/lib/constants'
import { ExploreAsset } from '@/lib/types'
import { cn, formatCurrency } from '@/lib/utils'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { AssetActionsContainer } from './asset-actions-container'
import { AssetAddToCartButton } from './asset-add-to-cart-button'
import { ShareButton } from './share-button'
import { Avatar } from './ui/avatar'
import { Badge } from './ui/badge'

export const Asset: FC<
  Pick<
    ExploreAsset,
    | 'id'
    | 'featuredImage'
    | 'title'
    | 'description'
    | 'category'
    | 'creator'
    | 'averageRating'
    | 'totalReviews'
    | 'basePrice'
  >
> = ({
  id,
  featuredImage,
  title,
  description,
  category,
  creator,
  averageRating,
  totalReviews,
  basePrice,
}) => {
  return (
    <Link
      href={ROUTES.assetsDetail(id)}
      key={id}
      prefetch
      className='group relative bg-background rounded-xl shadow-md transition-shadow duration-300 overflow-hidden border border-white hover:border-primary dark:border-primary dark:hover:border-white'
    >
      <div className='aspect-video overflow-hidden'>
        <Image
          fill
          src={featuredImage || '/placeholder.svg?height=400&width=600'}
          alt={title}
          className='object-cover transition-transform !relative  duration-300 group-hover:scale-105'
          priority
        />

        <AssetActionsContainer>
          <ShareButton assetId={id} />
        </AssetActionsContainer>
      </div>

      <div className='absolute top-3 left-3'>
        <Badge
          variant='secondary'
          className='bg-primary text-white w-fit shadow-lg'
        >
          {category.name}
        </Badge>
      </div>

      <div className='p-5'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center space-x-2'>
            <Avatar
              className='h-6 w-6'
              src={creator.user.image}
              alt={creator.user.name}
              fallback={creator.user.name?.charAt(0).toUpperCase()}
            />

            <span className='text-sm text-gray-500 dark:text-secondary-foreground'>
              {creator.user.name}
            </span>
          </div>

          <div className='flex items-center'>
            <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />

            <span className='ml-1 text-sm font-medium text-gray-600 dark:text-secondary-foreground'>
              {averageRating.toFixed(1)} ({totalReviews})
            </span>
          </div>
        </div>

        <h3 className='text-lg font-semibold text-gray-900 dark:text-secondary-foreground mb-1'>
          {title}
        </h3>
        <p className='text-sm text-gray-500 dark:text-secondary-foreground mb-4 line-clamp-2'>
          {description}
        </p>

        <div className={cn('flex items-center justify-between')}>
          <div>
            <AssetAddToCartButton
              id={id}
              title={title}
              basePrice={basePrice}
              featuredImage={featuredImage}
              size='sm'
            />
          </div>

          <span className='text-lg font-bold text-primary dark:text-primary-foreground'>
            {formatCurrency(basePrice)}
          </span>
        </div>
      </div>
    </Link>
  )
}
