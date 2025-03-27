import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import reviewStar from '../../public/review-star.svg'

export const FeaturedSection = async () => {
  const featuredAssets = await prisma.asset.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      category: true,
      creator: true,
    },
    orderBy: [{ sales: 'desc' }, { averageRating: 'desc' }],
    take: 3,
  })

  if (!featuredAssets.length) return null

  return (
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Featured Assets
            </h2>

            <p className='text-muted-foreground mt-1'>
              Handpicked premium assets from our marketplace
            </p>
          </div>

          <Button variant='ghost' className='mt-4 md:mt-0' asChild>
            <Link href={ROUTES.explore()}>
              View all assets
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {featuredAssets.map((asset, index) => (
            <Link href={`${ROUTES.assets()}/${asset.id}`} key={asset.id}>
              <Card className='h-full overflow-hidden border-border/50 card-hover'>
                <CardHeader className='p-0'>
                  <div className='relative aspect-[4/3] w-full overflow-hidden'>
                    <Image
                      src={
                        asset.featuredImage ||
                        '/placeholder.svg?height=400&width=600'
                      }
                      alt={`${asset.title} - ${asset.category.name} by ${asset.creator.name || 'Creator'}`}
                      fill
                      className='object-cover transition-all'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      priority={index < 2} // Only prioritize loading the first two images
                    />
                  </div>
                </CardHeader>

                <CardContent className='p-6'>
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
                          {(asset.creator.name || 'C').charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <span className='text-sm text-muted-foreground'>
                        {asset.creator.name || 'Unknown Creator'}
                      </span>
                    </div>

                    <div className='flex items-center'>
                      <Image
                        src={reviewStar}
                        width={16}
                        height={16}
                        alt='Review star'
                        className='mr-1'
                      />

                      <span className='text-sm font-medium'>
                        {asset.averageRating.toFixed(1)}
                      </span>

                      <span className='text-xs text-muted-foreground ml-1'>
                        ({asset.reviewCount})
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
