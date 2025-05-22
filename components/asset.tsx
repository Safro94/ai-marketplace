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
import { Badge } from './ui/badge'
import { Tooltip } from './ui/tooltip'

export const Asset: FC<
  Pick<
    ExploreAsset,
    | 'id'
    | 'featuredImage'
    | 'title'
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
            video: 'rounded-b-none',
            image:
              'object-fill transition-transform duration-300 group-hover:scale-105 rounded-b-none',
          }}
        />

        <AssetActionsContainer>
          <ShareButton assetId={id} />
          <AssetAddToCartButton
            id={id}
            size='icon'
            variant='outline'
            title={title}
            showText={false}
            basePrice={basePrice}
            className='w-6 h-6 md:h-10 md:w-10 z-50 bg-white text-black group rounded-full'
            skeletonClassName='w-6 h-6 md:h-10 md:w-10 rounded-full'
            featuredImage={featuredImage}
            primaryMediaType={primaryMediaType}
          />
        </AssetActionsContainer>

        <Badge
          variant='secondary'
          className='absolute shadow-sm shadow-primary bottom-2.5 left-2.5 bg-primary-foreground dark:text-primary hover:bg-primary-foreground font-bold'
        >
          {category.name}
        </Badge>
      </div>

      <div className='p-3 border-t border-t-primary/20'>
        <div className='flex items-center justify-between'>
          <Tooltip
            align='start'
            content={title}
            trigger={
              <h3 className='text-lg font-semibold text-gray-900 dark:text-secondary-foreground line-clamp-1'>
                {title}
              </h3>
            }
          />

          <span className='text-md font-bold text-primary dark:text-primary-foreground'>
            {!!basePrice ? formatCurrency(basePrice) : 'Free'}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-500 dark:text-secondary-foreground'>
            by <b>{creator.user.name}</b>
          </span>

          <div className='flex items-center'>
            <Star className='w-3 h-3 text-yellow-500 fill-yellow-500' />

            <span className='ml-1 text-xs font-medium text-gray-600 dark:text-secondary-foreground'>
              {averageRating.toFixed(1)} ({totalReviews})
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
