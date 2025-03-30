import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { ExploreAsset } from '@/lib/types'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { AssetAddToCartButton } from './asset-add-to-cart-button'
import { FavoriteButton } from './favorite-button'

export const Asset: FC<ExploreAsset> = ({
  id,
  featuredImage,
  title,
  category,
  creator,
  averageRating,
  totalReviews,
  basePrice,
}) => {
  return (
    <Card className='overflow-hidden border-0 shadow-none rounded-none'>
      <Link href={ROUTES.assetsDetail(id)} key={id}>
        <CardHeader className='p-0'>
          <div className='relative aspect-video w-full overflow-hidden '>
            <Image
              src={featuredImage || '/placeholder.svg?height=400&width=600'}
              alt={title}
              fill
              className='object-cover transition-all'
            />

            <div className='absolute right-3 top-3'>
              <FavoriteButton
                assetId={id}
                variant='ghost'
                size='icon'
                className='z-10 !h-fit !w-fit'
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex flex-col'>
              <h3 className='text-xl font-semibold'>{title}</h3>

              <span className='text-sm text-muted-foreground'>
                By {creator.name || 'Unknown Creator'}
              </span>
            </div>

            {basePrice && (
              <span className='text-lg font-bold'>${basePrice.toFixed(2)}</span>
            )}
          </div>

          <div className='flex items-center justify-between mb-3'>
            <Badge
              variant='secondary'
              className='bg-secondary/80 rounded-sm px-1'
            >
              {category.name}
            </Badge>

            <div className='flex items-center'>
              <StarIcon className='h-4 w-4 fill-yellow-400 text-yellow-400' />

              <span className='text-sm font-medium'>
                {averageRating.toFixed(1)}
              </span>

              <span className='text-xs text-muted-foreground ml-1'>
                ({totalReviews})
              </span>
            </div>
          </div>
        </CardContent>
      </Link>

      <AssetAddToCartButton
        id={id}
        title={title}
        price={basePrice}
        featuredImage={featuredImage}
        isLoading={false}
        variant='outline'
        className='w-full text-primary border-primary'
      />
    </Card>
  )
}
