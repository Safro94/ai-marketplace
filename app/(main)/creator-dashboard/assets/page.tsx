import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAssets } from '@/data-access/assets'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { CreatorDashboardAssetWithAnalytics } from '@/lib/types'
import { AssetStatus } from '@prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreatorDashboardAssetsList } from '../_components/creator-dashboard-asset-list'

interface AssetsByStatus {
  all: CreatorDashboardAssetWithAnalytics[]
  published: CreatorDashboardAssetWithAnalytics[]
  pending: CreatorDashboardAssetWithAnalytics[]
  rejected: CreatorDashboardAssetWithAnalytics[]
  draft: CreatorDashboardAssetWithAnalytics[]
  archived: CreatorDashboardAssetWithAnalytics[]
}

export default async function Page() {
  const { user } = await validateSession(ROUTES.creatorDashboard())
  const profile = await getUserProfile(user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  const assets = await getAssets({
    where: {
      creatorId: profile.id,
    },
    include: {
      assetAnalytics: {
        select: {
          uniqueViews: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const assetsByStatus = assets.reduce<AssetsByStatus>(
    (acc, asset) => {
      const statusMap: Record<AssetStatus, keyof Omit<AssetsByStatus, 'all'>> =
        {
          [AssetStatus.PUBLISHED]: 'published',
          [AssetStatus.PENDING_REVIEW]: 'pending',
          [AssetStatus.REJECTED]: 'rejected',
          [AssetStatus.DRAFT]: 'draft',
          [AssetStatus.ARCHIVED]: 'archived',
        }

      const statusKey = statusMap[asset.status]

      // Only push to the category if we have a valid mapping
      if (statusKey) {
        acc[statusKey].push(asset)
      }

      return acc
    },
    {
      all: assets,
      published: [],
      pending: [],
      rejected: [],
      draft: [],
      archived: [],
    },
  )
  return (
    <PageContainer className='md:p-0'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Products</h1>
          <p>Manage and monitor your products</p>
        </div>

        <Button asChild className='w-fit'>
          <Link href={ROUTES.creatorDashboardUpload()}>Upload New Asset</Link>
        </Button>
      </div>

      <Card className='pt-4'>
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
              <CreatorDashboardAssetsList assets={assetsByStatus.published} />
            </TabsContent>

            <TabsContent value='pending'>
              <CreatorDashboardAssetsList assets={assetsByStatus.pending} />
            </TabsContent>

            <TabsContent value='rejected'>
              <CreatorDashboardAssetsList assets={assetsByStatus.rejected} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
