import { ROUTES } from '@/lib/constants'
import { ExploreAsset } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import { AssetActionsContainer } from './asset-actions-container'
import { AssetAddToCartButton } from './asset-add-to-cart-button'
import { AssetPrimaryMedia } from './asset-primary-media'
import { ShareButton } from './share-button'
import { Avatar } from './ui/avatar'
import { Badge } from './ui/badge'
import { Tooltip } from './ui/tooltip'

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
    | 'primaryMediaType'
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
  primaryMediaType,
}) => {
  return (
    <Link
      href={ROUTES.assetsDetail(id)}
      key={id}
      className='group relative bg-background rounded-xl shadow-md transition-shadow duration-300 overflow-hidden border border-white hover:border-primary dark:border-primary dark:hover:border-white'
    >
      <div className='relative aspect-video overflow-hidden'>
        <AssetPrimaryMedia
          alt={title}
          src={featuredImage}
          type={primaryMediaType}
          classNames={{
            container: 'h-full w-full',
            image:
              'object-fill transition-transform duration-300 group-hover:scale-105',
          }}
        />

        <AssetActionsContainer>
          <ShareButton assetId={id} />
        </AssetActionsContainer>
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

        <Tooltip
          align='start'
          content={title}
          trigger={
            <h3 className='text-lg font-semibold text-gray-900 dark:text-secondary-foreground mb-1 line-clamp-1'>
              {title}
            </h3>
          }
        />

        <p
          dangerouslySetInnerHTML={{ __html: description }}
          className='text-sm text-gray-500 dark:text-secondary-foreground mb-4 line-clamp-3'
        />

        <div className='flex flex-col md:flex-row items-center gap-2 justify-between'>
          <Badge
            variant='secondary'
            className='bg-primary text-white hover:bg-primary self-center text-[11px]'
          >
            {category.name}
          </Badge>

          <div className='flex items-center gap-2'>
            <span className='text-md font-bold text-primary dark:text-primary-foreground'>
              {formatCurrency(basePrice)}
            </span>

            <AssetAddToCartButton
              id={id}
              size='icon'
              title={title}
              showText={false}
              basePrice={basePrice}
              className='w-[30px] h-[30px]'
              featuredImage={featuredImage}
              primaryMediaType={primaryMediaType}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
