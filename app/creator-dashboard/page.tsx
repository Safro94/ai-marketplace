import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/db/permissions'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { AssetStatus, PurchaseStatus } from '@prisma/client'
import { format } from 'date-fns'
import { DollarSign, Package, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreatorDashboardAssetsList } from './creator-dashboard-asset-list'

export default async function CreatorDashboard() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(ROUTES.login())
  }

  // Get creator profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  // Get creator stats
  const creatorStats = await prisma.creatorProfile.findUnique({
    where: { profileId: profile.id },
  })

  // Get recent sales
  const recentSales = await prisma.purchase.findMany({
    where: {
      asset: {
        creatorId: profile.id,
      },
      status: PurchaseStatus.COMPLETED,
    },
    include: {
      asset: {
        select: {
          title: true,
          slug: true,
        },
      },
      buyer: {
        select: {
          name: true,
        },
      },
      assetLicense: {
        include: {
          license: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  // Get assets by status
  const assets = await prisma.asset.findMany({
    where: {
      creatorId: profile.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const assetsByStatus = {
    all: assets,
    published: assets.filter((a) => a.status === AssetStatus.PUBLISHED),
    pending: assets.filter((a) => a.status === AssetStatus.PENDING_REVIEW),
    rejected: assets.filter((a) => a.status === AssetStatus.REJECTED),
    draft: assets.filter((a) => a.status === AssetStatus.DRAFT),
  }

  // Get total views
  const totalViews = assets.reduce((sum, asset) => sum + (asset.views || 0), 0)

  // Get average rating
  const assetsWithRatings = assets.filter((a) => a.averageRating !== null)
  const avgRating = assetsWithRatings.length
    ? assetsWithRatings.reduce((sum, a) => sum + (a.averageRating || 0), 0) /
      assetsWithRatings.length
    : 0

  return (
    <PageContainer>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Creator Dashboard</h1>
        <Button asChild>
          <Link href={ROUTES.creatorDashboardUpload()}>Upload New Asset</Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {[
          {
            title: 'Total Revenue',
            description: `${creatorStats?.totalRevenue.toFixed(2) || '0.00'}`,
            icon: <DollarSign className='h-5 w-5 text-primary' />,
          },
          {
            title: 'Total Sales',
            description: `${creatorStats?.totalSales || 0}`,
            icon: <Package className='h-5 w-5 text-primary' />,
          },
          {
            title: 'Total Views',
            description: totalViews,
            icon: <Users className='h-5 w-5 text-primary' />,
          },
          {
            title: 'Avgerage Rating',
            description: (
              <div className='flex items-center'>
                {avgRating.toFixed(1)}
                <Star className='h-4 w-4 text-yellow-400 fill-yellow-400 ml-1' />
              </div>
            ),
            icon: <Star className='h-5 w-5 text-primary' />,
          },
        ].map(({ title, description, icon }) => (
          <Card key={title}>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {title}
                  </p>

                  <h3 className='text-2xl font-bold mt-1'>{description}</h3>
                </div>

                <div className='p-2 bg-primary/10 rounded-full'>{icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
              <CardDescription>
                Manage and monitor your assets on the marketplace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue='all'>
                <TabsList className='mb-4'>
                  <TabsTrigger value='all'>
                    All ({assetsByStatus.all.length})
                  </TabsTrigger>
                  <TabsTrigger value='published'>
                    Published ({assetsByStatus.published.length})
                  </TabsTrigger>
                  <TabsTrigger value='pending'>
                    Pending ({assetsByStatus.pending.length})
                  </TabsTrigger>
                  <TabsTrigger value='rejected'>
                    Rejected ({assetsByStatus.rejected.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='all'>
                  <CreatorDashboardAssetsList assets={assetsByStatus.all} />
                </TabsContent>

                <TabsContent value='published'>
                  <CreatorDashboardAssetsList
                    assets={assetsByStatus.published}
                  />
                </TabsContent>

                <TabsContent value='pending'>
                  <CreatorDashboardAssetsList assets={assetsByStatus.pending} />
                </TabsContent>

                <TabsContent value='rejected'>
                  <CreatorDashboardAssetsList
                    assets={assetsByStatus.rejected}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Your most recent asset purchases
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!!recentSales.length ? (
                <div className='text-center py-8'>
                  <Package className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-muted-foreground'>No sales yet</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Sales will appear here once your assets start selling
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className='flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0'
                    >
                      <div>
                        <p className='font-medium'>{sale.asset.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          {sale.assetLicense?.license.name} •{' '}
                          {format(new Date(sale.createdAt), 'MMM d')}
                        </p>
                      </div>
                      <p className='font-medium'>${sale.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
