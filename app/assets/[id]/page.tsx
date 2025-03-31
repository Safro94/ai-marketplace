import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselThumbnails,
} from '@/components/ui/carousel'
import { ROUTES } from '@/lib/constants'
import { checkUserPurchasedAsset } from '@/lib/db/purchases'
import prisma from '@/lib/prisma'
import { generateProductJsonLd } from '@/lib/seo-config'
import { getServerSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { AssetDetailHeader } from './asset-detail-header'
import { AssetDetailsTabs } from './asset-details-tabs'
import { AssetDownload } from './asset-download'
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
      canonical: ROUTES.assetsDetail(id),
    },
    openGraph: {
      title: asset.title,
      description: asset.description,
      url: ROUTES.assetsDetail(id),
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
              price: asset.basePrice,
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
        <BreadcrumbNavigation
          items={[
            { text: 'Explore', link: ROUTES.explore() },
            { text: asset.title },
          ]}
        />

        <AssetDetailHeader {...asset} />

        <div className='grid lg:grid-cols-[1fr_max-content] gap-8'>
          <div className='space-y-8'>
            <Carousel className='w-full'>
              <CarouselContent>
                {[asset.featuredImage, ...asset.galleryImages].map(
                  (image, index) => (
                    <CarouselItem key={index}>
                      <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/50'>
                        <Image
                          src={image || '/placeholder.svg?height=600&width=800'}
                          alt={asset.title}
                          fill
                          className='object-cover'
                          priority
                        />
                      </div>
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>
              <CarouselThumbnails images={asset.galleryImages} />
            </Carousel>

            {/* Asset Details */}
            <AssetDetailsTabs
              id={asset.id}
              description={asset.description}
              features={features}
              requirements={requirements}
              reviews={asset.reviews}
              isPurchased={isPurchased}
            />

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
              </CardContent>
            </Card>

            {/* Related Assets */}
            <div className='!mt-24'>
              <h2 className='text-2xl font-bold tracking-tight mb-6'>
                You May Also Like
              </h2>

              <RelatedAssets
                currentAssetId={asset.id}
                categoryId={asset.categoryId}
              />
            </div>
          </div>

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
    </>
  )
}
