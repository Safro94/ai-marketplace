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
import { Tooltip } from '@/components/ui/tooltip'
import { getAssets } from '@/data-access/assets'
import { getCreatorAnalyticsByCreatorProfileId } from '@/data-access/creator-analytics'
import { getCreatorProfileByProfileId } from '@/data-access/creator-profile'
import { getUserProfile } from '@/data-access/profile'
import { getAllCreatorDashboardPurchasesByAssetCreator } from '@/data-access/purchases'
import { ROUTES, SERVICE_CHARGE } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { formatCurrency } from '@/lib/utils'
import { AssetStatus } from '@prisma/client'
import { format } from 'date-fns'
import { DollarSign, InfoIcon, Package, Star } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreatorDashboardAssetsList } from './_components/creator-dashboard-asset-list'

export default async function CreatorDashboard() {
  const { user } = await validateSession(ROUTES.creatorDashboard())

  const profile = await getUserProfile(user.id)
  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  // Get creator profile
  const creatorProfile = await getCreatorProfileByProfileId(profile.id)

  if (!creatorProfile) {
    redirect(ROUTES.creators())
  }

  // Get creator stats
  const creatorStats = await getCreatorAnalyticsByCreatorProfileId(
    creatorProfile.id,
  )

  // Get recent sales
  const recentSales = await getAllCreatorDashboardPurchasesByAssetCreator(
    profile.id,
  )

  // Get assets by status
  const assets = await getAssets({
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
  // const totalViews = assets.reduce((sum, asset) => sum + (asset.views || 0), 0)

  // Get average rating
  const assetsWithRatings = assets.filter((a) => a.averageRating !== null)
  const avgRating = assetsWithRatings.length
    ? assetsWithRatings.reduce((sum, a) => sum + (a.averageRating || 0), 0) /
      assetsWithRatings.length
    : 0

  return (
    <PageContainer>
      <div className='flex flex-col gap-2 md:flex-row md:justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Creator Dashboard</h1>
        <Button asChild>
          <Link href={ROUTES.creatorDashboardUpload()}>Upload New Asset</Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {[
          {
            title: (
              <span className='flex gap-1 items-center'>
                Total Revenue
                <Tooltip
                  content='Total sales - platform commission'
                  trigger={
                    <InfoIcon className='h-4 w-4 text-primary cursor-pointer' />
                  }
                />
              </span>
            ),
            description: formatCurrency(
              creatorStats?.totalRevenue
                ? creatorStats.totalRevenue -
                    creatorStats.totalRevenue * SERVICE_CHARGE
                : 0,
            ),
            icon: <DollarSign className='h-5 w-5 text-primary' />,
          },
          {
            title: 'Total Sales',
            description: `${creatorStats?.totalSales || 0}`,
            icon: <Package className='h-5 w-5 text-primary' />,
          },
          // {
          //   title: 'Total Views',
          //   description: totalViews,
          //   icon: <Users className='h-5 w-5 text-primary' />,
          // },
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
        ].map(({ title, description, icon }, i) => (
          <Card key={i}>
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
              {!recentSales.length ? (
                <div className='text-center py-8'>
                  <Package className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-muted-foreground'>No sales yet</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Sales will appear here once your assets start selling
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {recentSales.map((sale) => {
                    return sale.purchaseItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0'
                      >
                        <div>
                          <p className='font-medium'>{item.asset.title}</p>
                          <p className='text-sm text-muted-foreground'>
                            {item.assetLicense?.license.name} •{' '}
                            {format(new Date(item.createdAt), 'MMM d')}
                          </p>
                        </div>
                        <p className='font-medium'>${item.amount.toFixed(2)}</p>
                      </div>
                    ))
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
