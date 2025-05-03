import { PageContainer } from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { getAllCreatorDashboardPurchasesByAssetCreator } from '@/data-access/purchases'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS } from '@/lib/constants'
import { Package } from 'lucide-react'
import { validateCreatorDashboardAccess } from '../utils'
import { CreatorDashboardSalesList } from './_components/sales-list'

export default async function Page() {
  const { profile } = await validateCreatorDashboardAccess()

  // Get recent sales
  const recentSales = await getAllCreatorDashboardPurchasesByAssetCreator({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <PageContainer className='md:p-0'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Recent Sales</h1>
        <p>Your most recent asset purchases</p>
      </div>

      <Card className='pt-4'>
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
            <div className='flex flex-col gap-4'>
              <CreatorDashboardSalesList recentSales={recentSales} />
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
