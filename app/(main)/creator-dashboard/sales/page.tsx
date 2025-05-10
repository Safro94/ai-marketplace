import { DashboardPageContainer } from '@/components/page-container'
import { CreatorDashboardSalesSkeleton } from '@/components/skeletons/creator-dashboard-sales-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { getAllCreatorDashboardPurchasesByAssetCreator } from '@/data-access/purchases'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS } from '@/lib/constants'
import { Package } from 'lucide-react'
import { Suspense } from 'react'
import { validateCreatorDashboardAccess } from '../utils'
import { CreatorDashboardSalesList } from './_components/sales-list'

export default async function Page() {
  return (
    <DashboardPageContainer
      title='Recent Sales'
      description='Your most recent asset purchases'
    >
      <Card className='pt-4'>
        <CardContent>
          <Suspense fallback={<CreatorDashboardSalesSkeleton />}>
            <Component />
          </Suspense>
        </CardContent>
      </Card>
    </DashboardPageContainer>
  )
}

const Component = async () => {
  const { profile } = await validateCreatorDashboardAccess()

  // Get recent sales
  const recentSales = await getAllCreatorDashboardPurchasesByAssetCreator({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <>
      {!recentSales.length ? (
        <div className='text-center py-8'>
          <Package className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
          <p className='text-muted-foreground'>No sales yet</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Sales will appear here once your assets start selling
          </p>
        </div>
      ) : (
        <CreatorDashboardSalesList recentSales={recentSales} />
      )}
    </>
  )
}
