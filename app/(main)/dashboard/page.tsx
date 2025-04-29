import { NotFound } from '@/components/not-found'
import { getUserProfile } from '@/data-access/profile'
import { getAllPurchasesByProfileId } from '@/data-access/purchases'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { PurchaseStatus } from '@prisma/client'
import { FileText } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DashboardPurchasesList } from './_components/dashboard-purchases-list'

export default async function Purchases() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const purchases = await getAllPurchasesByProfileId({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
    where: {
      status: PurchaseStatus.COMPLETED,
    },
  })

  return (
    <>
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
    </>
  )
}
