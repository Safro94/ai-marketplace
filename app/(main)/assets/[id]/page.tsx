import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { getAssetById, getAssets } from '@/data-access/assets'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { generateProductJsonLd } from '@/lib/seo-config'
import { formatDate } from '@/lib/utils'
import { AssetStatus, ReviewStatus } from '@prisma/client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Suspense } from 'react'
import { AssetDetailAnalytics } from './_components/asset-detail-analytics'
import { AssetDetailCarousel } from './_components/asset-detail-carousel'
import { AssetDetailCreatorInfo } from './_components/asset-detail-creator-info'
import { AssetDetailHeader } from './_components/asset-detail-header'
import { AssetDetailsTabs } from './_components/asset-details-tabs'
import { getLicenses } from './_components/asset-details-utils'
import { AssetDownload } from './_components/asset-download'
import { LicenseSkeleton } from './_components/license-skeleton'
import { PurchaseOptions } from './_components/purchase-options'
import { RelatedAssets } from './_components/related-assets'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const id = (await params).id

  const asset = await getAssetById(id, {
    category: true,
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

export async function generateStaticParams() {
  // Get the most popular assets
  const popularAssets = await getAssets({
    where: {
      status: AssetStatus.PUBLISHED,
    },
    orderBy: [{ sales: 'desc' }, { averageRating: 'desc' }],
    take: 50, // Generate static pages for top 50 assets
    select: {
      id: true,
    },
  })

  return popularAssets.map((asset) => ({
    id: asset.id,
  }))
}

export const revalidate = 3600 // Revalidate every hour

export default async function AssetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const assetId = (await params).id

  const asset = await getAssetById(assetId, {
    category: {
      select: {
        name: true,
      },
    },
    creator: {
      select: {
        bio: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    },
    reviews: {
      where: {
        status: ReviewStatus.APPROVED,
      },
      include: {
        userProfile: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: INFINITE_SCROLL_NUMBER_OF_ITEMS,
    },
  })

  if (!asset) notFound()

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
                name: asset.creator.user.name || 'Unknown Creator',
              },
            }),
          ),
        }}
      />

      <PageContainer>
        <BreadcrumbNavigation
          items={[
            { text: 'Explore', link: ROUTES.explore() },
            { text: asset.title },
          ]}
        />

        <AssetDetailHeader {...asset} />

        <div className='grid lg:grid-cols-[2fr_1fr] gap-8'>
          <div className='space-y-8'>
            <AssetDetailCarousel
              id={asset.id}
              featuredImage={asset.featuredImage}
              galleryImages={asset.galleryImages}
              title={asset.title}
            />

            {/* Asset Details */}
            <AssetDetailsTabs
              id={asset.id}
              description={asset.description}
              reviews={asset.reviews}
              features={features}
              requirements={requirements}
            />

            {/* Creator Info (Mobile) */}
            <AssetDetailCreatorInfo
              name={asset.creator.user.name}
              bio={asset.creator.bio}
              className='lg:hidden'
            />
          </div>

          <div className='space-y-6 lg:sticky lg:top-20'>
            <AssetDownload
              assetId={asset.id}
              fileName={asset.title}
              assetUrl={asset.assetFile}
            />

            <Suspense fallback={<LicenseSkeleton />}>
              <PurchaseOptions
                assetId={asset.id}
                assetImage={asset.featuredImage}
                assetTitle={asset.title}
                getLicenses={getLicenses(asset.id)}
              />
            </Suspense>

            {/* Creator Info (Desktop) */}
            <AssetDetailCreatorInfo
              name={asset.creator.user.name}
              bio={asset.creator.bio}
            />

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
      </PageContainer>

      <AssetDetailAnalytics assetId={asset.id} />
    </>
  )
}
