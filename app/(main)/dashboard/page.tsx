import { NotFound } from '@/components/not-found'
import { DashboardPageContainer } from '@/components/page-container'
import { getAllPurchasesByProfileId } from '@/data-access/purchases'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { PurchaseStatus } from '@prisma/client'
import { FileText } from 'lucide-react'
import { DashboardPurchasesList } from './_components/dashboard-purchases-list'
import { getCachedProfileData } from './utils'

export default async function Purchases() {
  const { profile } = await getCachedProfileData()

  const purchases = await getAllPurchasesByProfileId({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
    where: {
      status: PurchaseStatus.COMPLETED,
    },
  })

  return (
    <DashboardPageContainer title='Assets'>
      {!!purchases.length ? (
        <div className='space-y-6'>
          <DashboardPurchasesList purchases={purchases} />
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
    </DashboardPageContainer>
  )
}
