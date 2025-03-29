import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import { checkUserPurchasedAsset } from '@/lib/db/purchases'
import prisma from '@/lib/prisma'
import { generateProductJsonLd } from '@/lib/seo-config'
import { getServerSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import reviewStar from '../../../public/review-star.svg'
import { AssetDownload } from './asset-download'
import { AssetReviews } from './asset-reviews'
import { PurchaseOptions } from './purchase-options'
import { RelatedAssets } from './related-assets'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const id = (await params).id

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })

  if (!asset) {
    return {
      title: 'Asset Not Found',
      description: 'The requested asset could not be found',
    }
  }

  return {
    title: asset.title,
    description: asset.description,
    alternates: {
      canonical: `/assets/${id}`,
    },
    openGraph: {
      title: asset.title,
      description: asset.description,
      url: `${ROUTES.assets()}/${id}`,
      images: [
        {
          url: asset.featuredImage,
          width: 800,
          height: 600,
          alt: asset.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: asset.title,
      description: asset.description,
      images: [asset.featuredImage],
    },
    other: {
      type: 'product',
    },
  }
}

export default async function AssetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()
  const id = (await params).id

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      category: true,
      creator: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  })

  if (!asset) notFound()

  // Check if the user has purchased this asset
  let isPurchased = false
  if (session?.user) {
    isPurchased = await checkUserPurchasedAsset(session.user.id, asset.id)
  }

  // Parse features and requirements from JSON strings
  const features = Array.isArray(asset.features)
    ? asset.features
    : JSON.parse((asset.features as string) || '[]')

  const requirements = Array.isArray(asset.requirements)
    ? asset.requirements
    : JSON.parse((asset.requirements as string) || '[]')

  return (
    <>
      <Script
        id='product-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateProductJsonLd({
              id: asset.id,
              title: asset.title,
              description: asset.description,
              price: asset.price,
              image: asset.featuredImage,
              category: asset.category.name,
              rating: asset.averageRating,
              reviews: asset.reviews.length,
              creator: {
                name: asset.creator.name || 'Unknown Creator',
              },
            }),
          ),
        }}
      />
      <div className='container py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='space-y-8'>
              {/* Asset Header */}
              <div>
                <div className='flex items-center space-x-2 mb-2'>
                  <Badge variant='secondary' className='bg-secondary/80'>
                    {asset.category.name}
                  </Badge>

                  <Badge variant='outline'>{asset.useCase}</Badge>
                </div>

                <h1 className='text-3xl font-bold tracking-tight mb-3'>
                  {asset.title}
                </h1>

                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <Avatar className='h-8 w-8'>
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

                    <span className='text-sm'>
                      by{' '}
                      <span className='font-medium'>
                        {asset.creator.name || 'Unknown Creator'}
                      </span>
                    </span>
                  </div>

                  <div className='flex items-center'>
                    <Image
                      src={reviewStar}
                      width={16}
                      height={16}
                      alt='Review star'
                    />

                    <span className='text-sm font-medium'>
                      {asset.averageRating.toFixed(1)}
                    </span>

                    <span className='text-xs text-muted-foreground ml-1'>
                      ({asset.reviews.length} reviews)
                    </span>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    {asset.sales} sales
                  </div>
                </div>
              </div>

              {/* Asset Gallery */}
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/50'>
                <Image
                  src={
                    asset.featuredImage ||
                    '/placeholder.svg?height=600&width=800'
                  }
                  alt={asset.title}
                  fill
                  className='object-cover'
                  priority
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                {asset.galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className='relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/50'
                  >
                    <Image
                      src={image || '/placeholder.svg?height=300&width=400'}
                      alt={`${asset.title} preview ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>

              {/* Asset Details */}
              <Tabs defaultValue='description'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='description'>Description</TabsTrigger>
                  <TabsTrigger value='features'>Features</TabsTrigger>
                  <TabsTrigger value='reviews'>Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value='description' className='pt-6'>
                  <div
                    className='prose prose-invert max-w-none'
                    dangerouslySetInnerHTML={{ __html: asset.longDescription }}
                  />
                </TabsContent>

                <TabsContent value='features' className='pt-6'>
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-xl font-semibold mb-3'>Features</h3>

                      <ul className='space-y-2'>
                        {features.map((feature: string, index: number) => (
                          <li key={index} className='flex items-start'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5'
                              aria-hidden='true'
                            >
                              <path
                                fillRule='evenodd'
                                d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold mb-3'>
                        Requirements
                      </h3>

                      <ul className='space-y-2'>
                        {requirements.map(
                          (requirement: string, index: number) => (
                            <li key={index} className='flex items-start'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                                fill='currentColor'
                                className='w-5 h-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5'
                                aria-hidden='true'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z'
                                  clipRule='evenodd'
                                />
                              </svg>
                              <span>{requirement}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='reviews' className='pt-6'>
                  <AssetReviews
                    assetId={asset.id}
                    initialReviews={asset.reviews}
                  />
                </TabsContent>
              </Tabs>

              {/* Creator Info (Mobile) */}
              <Card className='lg:hidden border-border/50'>
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-4 mb-4'>
                    <Avatar className='h-12 w-12'>
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

                    <div>
                      <h3 className='font-semibold'>
                        {asset.creator.name || 'Unknown Creator'}
                      </h3>
                      <p className='text-sm text-muted-foreground'>Creator</p>
                    </div>
                  </div>

                  <p className='text-sm mb-4'>
                    {asset.creator.bio || 'No bio available'}
                  </p>

                  <Button variant='outline' className='w-full' asChild>
                    <Link href={`${ROUTES.creators()}/${asset.creator.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Related Assets */}
              <div>
                <h2 className='text-2xl font-bold tracking-tight mb-6'>
                  You May Also Like
                </h2>

                <RelatedAssets
                  currentAssetId={asset.id}
                  categoryId={asset.categoryId}
                />
              </div>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='space-y-6 lg:sticky lg:top-20'>
              {/* Purchase Options or Download */}
              {isPurchased ? (
                <AssetDownload assetId={asset.id} isPurchased />
              ) : (
                <PurchaseOptions
                  assetId={asset.id}
                  assetImage={asset.featuredImage}
                  assetTitle={asset.title}
                />
              )}

              {/* Creator Info (Desktop) */}
              <Card className='hidden lg:block border-border/50'>
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-4 mb-4'>
                    <Avatar className='h-12 w-12'>
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

                    <div>
                      <h3 className='font-semibold'>
                        {asset.creator.name || 'Unknown Creator'}
                      </h3>
                      <p className='text-sm text-muted-foreground'>Creator</p>
                    </div>
                  </div>

                  <p className='text-sm mb-4'>
                    {asset.creator.bio || 'No bio available'}
                  </p>

                  {/* <Button variant='outline' className='w-full' asChild>
                    <Link href={`${ROUTES.creators()}/${asset.creator.id}`}>
                      View Profile
                    </Link>
                  </Button> */}
                </CardContent>
              </Card>

              {/* Asset Information */}
              <Card className='border-border/50'>
                <CardContent className='p-6'>
                  <h3 className='font-semibold mb-4'>Asset Information</h3>

                  <div className='space-y-3 text-sm'>
                    {[
                      {
                        title: 'Created',
                        subtitle: formatDate(asset.createdAt),
                      },
                      {
                        title: 'Last updated',
                        subtitle: formatDate(asset.updatedAt),
                      },
                      {
                        title: 'Category',
                        subtitle: asset.category.name,
                      },
                      {
                        title: 'Use Case',
                        subtitle: asset.useCase,
                      },
                    ].map(({ title, subtitle }) => (
                      <div key={title} className='flex justify-between'>
                        <span className='text-muted-foreground'>{title}</span>
                        <span>{subtitle}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
