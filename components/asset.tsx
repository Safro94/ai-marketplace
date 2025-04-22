import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { getServerSession } from '@/lib/session'
import { ExploreAsset } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { AssetAddToCartButton } from './asset-add-to-cart-button'
import { AssetOptions } from './asset-options'

export const Asset: FC<ExploreAsset> = async ({
  id,
  featuredImage,
  title,
  category,
  creator,
  averageRating,
  totalReviews,
  basePrice,
}) => {
  const session = await getServerSession()

  return (
    <Card className='overflow-hidden shadow-md grid gap-2 h-[375px]'>
      <Link
        href={ROUTES.assetsDetail(id)}
        key={id}
        className='flex-1 grid grid-rows-[200px,1fr]'
        prefetch
      >
        <CardHeader className='p-0 block relative w-full'>
          <Image
            fill
            src={featuredImage || '/placeholder.svg?height=400&width=600'}
            alt={title}
            className='object-contain !max-h-[200px] !relative'
            priority
          />

          <AssetOptions assetId={id} />
        </CardHeader>

        <CardContent className='p-2 flex-1 grid'>
          <div className='grid grid-cols-[70%_1fr] gap-4 overflow-hidden'>
            <div>
              <h3 className='text-xl font-semibold truncate'>{title}</h3>

              <span className='text-sm text-muted-foreground'>
                By {creator.user.name || 'Unknown Creator'}
              </span>
            </div>

            <span className='text-lg font-bold justify-self-end'>
              {formatCurrency(basePrice)}
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

        <CardFooter className='p-2'>
          {session?.user && (
            <AssetAddToCartButton
              id={id}
              title={title}
              basePrice={basePrice}
              featuredImage={featuredImage}
              variant='outline'
              className='w-full border-primary'
            />
          )}
        </CardFooter>
      </Link>
    </Card>
  )
}
