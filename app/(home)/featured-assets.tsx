import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

export const FeaturedAssets = async () => {
  // Fetch featured assets from the database
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

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {featuredAssets.map((asset, index) => (
        <Link href={`/assets/${asset.id}`} key={asset.id}>
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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-4 h-4 text-yellow-500 mr-1'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                      clipRule='evenodd'
                    />
                  </svg>
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
  )
}
