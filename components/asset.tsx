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
    <Card className='overflow-hidden border-0 shadow-none rounded-none flex flex-col gap-2 h-[375px] lg:h-[400px]'>
      <Link
        href={ROUTES.assetsDetail(id)}
        key={id}
        className='flex-1 flex flex-col'
      >
        <CardHeader className='p-0'>
          <div className='relative w-full overflow-hidden'>
            <Image
              fill
              src={featuredImage || '/placeholder.svg?height=400&width=600'}
              alt={title}
              className='object-cover !max-h-[200px] !relative'
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

        <CardContent className='p-0 py-2 flex-1 flex flex-col'>
          <div className='flex justify-between gap-4'>
            <div>
              <h3 className='text-xl font-semibold mb-1'>{title}</h3>

              <span className='text-sm text-muted-foreground'>
                By {creator.name || 'Unknown Creator'}
              </span>
            </div>

            <span className='text-lg font-bold justify-self-end'>
              ${basePrice.toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between mt-auto'>
            <Badge
              variant='secondary'
              className='bg-secondary/80 rounded-sm w-fit px-1'
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
