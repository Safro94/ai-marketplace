import { NotFound } from '@/components/not-found'
import { PageContainer } from '@/components/page-container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUserProfile } from '@/data-access/profile'
import { getAllPurchasesByProfileId } from '@/data-access/purchases'
import {
  APP_DATA,
  INFINITE_SCROLL_NUMBER_OF_ITEMS,
  ROUTES,
} from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Purchase } from './_components/purchase'
import { PurchasesList } from './_components/purchases-list'

export const metadata: Metadata = {
  title: `My Purchases | ${APP_DATA.name}`,
  description: 'View and download your purchased AI assets',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PurchasesPage() {
  const { user } = await validateSession(ROUTES.purchases())
  const profile = await getUserProfile(user.id)
  if (!profile) redirect(ROUTES.home())

  const purchases = await getAllPurchasesByProfileId({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <PageContainer>
      <div className='mb-4'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>My Purchases</h1>
        <p className='text-muted-foreground'>
          View and download your purchased AI assets
        </p>
      </div>

      <Tabs defaultValue='all'>
        <TabsList className='mb-6'>
          <TabsTrigger value='all'>All Purchases</TabsTrigger>
          <TabsTrigger value='recent'>Recent</TabsTrigger>
        </TabsList>

        <TabsContent value='all'>
          {!purchases.length ? (
            <NotFound
              title='No purchases yet'
              description="You haven't purchased any assets yet. Explore our marketplace to find AI assets that can help you."
              icon={ShoppingBag}
              btnLink={ROUTES.explore()}
              btnText='Explore Assets'
            />
          ) : (
            <PurchasesList purchases={purchases} />
          )}
        </TabsContent>

        <TabsContent value='recent'>
          {!purchases.length ? (
            <NotFound
              title='No recent purchases'
              description="You haven't purchased any assets recently. Explore our marketplace to find AI assets that can help you."
              icon={ShoppingBag}
              btnLink={ROUTES.explore()}
              btnText='Explore Assets'
            />
          ) : (
            <div className='space-y-6'>
              {purchases.slice(0, 5).map((purchase) => (
                <Purchase key={purchase.id} {...purchase} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
