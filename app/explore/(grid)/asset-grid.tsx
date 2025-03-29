import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { Pagination } from '@/lib/types'
import { Category, Asset as PrismaAsset, Profile, User } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { ExplorePagination } from './explore-pagination'
import { ExploreSortBySelector } from './explore-sort-by-selector'

interface Props {
  assets: Asset[] | undefined
  pagination: Pagination | undefined
}

interface Asset extends PrismaAsset {
  category: Category
  creator: Profile & {
    user: User
  }
}

export const AssetGrid: FC<Props> = ({ assets, pagination }) => {
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-sm text-muted-foreground'>
          Showing{' '}
          <span className='font-medium text-foreground'>
            {assets?.length || 0}
          </span>{' '}
          results
        </p>

        <ExploreSortBySelector />
      </div>

      {assets?.length ? (
        <>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6'>
            {assets.map((asset) => (
              <Link href={`${ROUTES.assets()}/${asset.id}`} key={asset.id}>
                <Card className='overflow-hidden border-border/50 card-hover'>
                  <CardHeader className='p-0'>
                    <div className='relative aspect-[4/3] w-full overflow-hidden'>
                      <Image
                        src={
                          asset.featuredImage ||
                          '/placeholder.svg?height=400&width=600'
                        }
                        alt={asset.title}
                        fill
                        className='object-cover transition-all'
                      />
                    </div>
                  </CardHeader>

                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <Badge variant='secondary' className='bg-secondary/80'>
                        {asset.category.name}
                      </Badge>

                      <span className='text-lg font-bold'>${asset.price}</span>
                    </div>

                    <h3 className='text-xl font-semibold mb-2 line-clamp-1'>
                      {asset.title}
                    </h3>

                    <p className='text-muted-foreground text-sm line-clamp-2 mb-4'>
                      {asset.description}
                    </p>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Avatar className='h-6 w-6'>
                          <AvatarImage
                            src={
                              asset.creator.avatarUrl ||
                              '/placeholder.svg?height=40&width=40'
                            }
                            alt={asset.creator.name || 'Creator'}
                          />

                          <AvatarFallback>
                            {asset.creator.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <span className='text-sm text-muted-foreground'>
                          {asset.creator.name || 'Unknown Creator'}
                        </span>
                      </div>

                      <div className='flex items-center'>
                        <StarIcon className='h-4 w-4 fill-yellow-400 text-yellow-400' />

                        <span className='text-sm font-medium'>
                          {asset.averageRating.toFixed(1)}
                        </span>

                        <span className='text-xs text-muted-foreground ml-1'>
                          ({asset.totalReviews})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <ExplorePagination pagination={pagination} />
        </>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>
            No assets found matching your criteria
          </p>
        </div>
      )}
    </div>
  )
}
