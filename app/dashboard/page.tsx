import { AssetDownloadButton } from '@/components/asset-download-button'
import { NotFound } from '@/components/not-found'
import { PageContainer } from '@/components/page-container'
import { PurchasedItemCard } from '@/components/purchased-item-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import { getUserProfile } from '@/lib/db/users'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import { PurchaseStatus } from '@prisma/client'
import { Download, FileText, Star, StarIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

enum TabsEnum {
  ASSETS = 'assets',
  DOWNLOADS = 'downloads',
  FAVORITES = 'favorites',
  REVIEWS = 'reviews',
}

export const metadata: Metadata = {
  title: 'User Dashboard | AIAssets Marketplace',
  description: 'Manage your purchased assets and account',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const purchases = await prisma.purchase.findMany({
    where: {
      buyerId: profile.id,
      status: PurchaseStatus.COMPLETED,
    },
    include: {
      purchaseItems: {
        include: {
          asset: {
            include: {
              category: true,
              creator: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          assetLicense: {
            include: {
              license: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const downloadHistory = await prisma.download.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      purchaseItem: {
        include: {
          asset: true,
        },
      },
    },
    orderBy: {
      downloadedAt: 'desc',
    },
  })

  const reviews = await prisma.review.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      asset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      asset: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <PageContainer>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Manage your purchased assets and account
          </p>
        </div>

        <Button className='mt-4 md:mt-0' variant='outline' asChild>
          <Link href={ROUTES.explore()}>Browse More Assets</Link>
        </Button>
      </div>

      <Tabs defaultValue={TabsEnum.ASSETS}>
        <TabsList className='mb-6'>
          <TabsTrigger value={TabsEnum.ASSETS}>My Purchased Assets</TabsTrigger>
          <TabsTrigger value={TabsEnum.DOWNLOADS}>Download History</TabsTrigger>
          <TabsTrigger value={TabsEnum.FAVORITES}>Favorites</TabsTrigger>
          <TabsTrigger value={TabsEnum.REVIEWS}>My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value={TabsEnum.ASSETS}>
          {!!purchases.length ? (
            <div className='space-y-6'>
              {purchases.map((purchase) => {
                return purchase.purchaseItems.map((purchasedItem) => (
                  <PurchasedItemCard
                    key={purchase.id}
                    purchasedItem={purchasedItem}
                  />
                ))
              })}
            </div>
          ) : (
            <NotFound
              title='No assets yet'
              description="You haven't purchased any assets yet. Browse our marketplace to find AI assets that can help you."
              icon={FileText}
              btnLink={ROUTES.explore()}
              btnText='Browse Marketplace'
            />
          )}
        </TabsContent>

        <TabsContent value={TabsEnum.DOWNLOADS}>
          <Card>
            {!!downloadHistory.length ? (
              <CardContent className='py-6'>
                <div className='space-y-4'>
                  {downloadHistory.map((download) => (
                    <div
                      key={download.id}
                      className='flex items-center justify-between border-b pb-4 last:border-0'
                    >
                      <div className='flex items-center'>
                        <div className='relative h-12 w-12 rounded overflow-hidden mr-4'>
                          <Image
                            src={
                              download.purchaseItem.asset.featuredImage ||
                              '/placeholder.svg?height=80&width=80'
                            }
                            alt={download.purchaseItem.asset.title}
                            fill
                            className='object-cover'
                          />
                        </div>

                        <div>
                          <h4 className='font-medium'>
                            {download.purchaseItem.asset.title}
                          </h4>

                          <p className='text-xs text-muted-foreground'>
                            Downloaded on{' '}
                            {formatDate(download.purchaseItem.createdAt)}
                          </p>
                        </div>
                      </div>

                      <AssetDownloadButton
                        assetId={download.purchaseItem.asset.id}
                        purchaseItemId={download.purchaseItem.id}
                        assetFileUrl={download.purchaseItem.asset.assetFile}
                        fileName={download.purchaseItem.asset.title}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            ) : (
              <NotFound
                title='No downloads yet'
                description="You haven't downloaded any assets yet. Visit your purchased assets to download them."
                icon={Download}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value={TabsEnum.FAVORITES}>
          <Card>
            {!!favorites.length ? (
              <CardContent className='py-6'>
                <div className='grid  md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {favorites.map((favorite) => {
                    return (
                      <Card key={favorite.id} className='overflow-hidden'>
                        <div className='relative aspect-[4/3] w-full'>
                          <Image
                            src={
                              favorite.asset.featuredImage ||
                              '/placeholder.svg?height=400&width=600'
                            }
                            alt={favorite.asset.title}
                            fill
                            className='object-cover'
                          />
                        </div>

                        <CardContent className='p-4'>
                          <Badge variant='secondary' className='mb-2'>
                            {favorite.asset.category.name}
                          </Badge>

                          <h3 className='font-medium mb-1'>
                            {favorite.asset.title}
                          </h3>

                          <p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
                            {favorite.asset.description}
                          </p>

                          <div className='flex justify-between items-center'>
                            <span className='font-bold'>
                              ${favorite.asset.basePrice}
                            </span>

                            <Button size='sm' asChild>
                              <Link
                                href={`${ROUTES.assets()}/${favorite.asset.id}`}
                              >
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            ) : (
              <NotFound
                title='No favorites yet'
                description="You haven't added any assets to your favorites yet. Browse the marketplace and save assets you're interested in."
                icon={Star}
                btnLink={ROUTES.explore()}
                btnText='Browse Marketplace'
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value={TabsEnum.REVIEWS}>
          <Card>
            {!!reviews.length ? (
              <CardContent className='py-6'>
                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className='border-b pb-6 last:border-0'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <h4 className='font-medium'>{review.asset.title}</h4>
                          <div className='flex mt-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className='h-4 w-4 fill-yellow-400 text-yellow-400'
                              />
                            ))}
                          </div>
                        </div>

                        <div className='text-xs text-muted-foreground'>
                          {formatDate(review.createdAt)}
                        </div>
                      </div>

                      <h5 className='font-medium mb-1'>{review.title}</h5>

                      <p className='text-sm text-muted-foreground'>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            ) : (
              <NotFound
                title='No reviews yet'
                description="You haven't written any reviews yet. Share your experience with assets you've purchased."
                icon={FileText}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
