import { NotFound } from '@/components/not-found'
import { PageContainer } from '@/components/page-container'
import { PurchasedItemCard } from '@/components/purchased-item-card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import { getUserProfile } from '@/lib/db/users'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import { Search, ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Fragment } from 'react'

export const metadata: Metadata = {
  title: 'My Purchases | AIAssets Marketplace',
  description: 'View and download your purchased AI assets',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { user } = await validateSession(ROUTES.purchases())
  const profile = await getUserProfile(user.id)
  if (!profile) redirect(ROUTES.home())

  // Get user's purchases
  const searchQuery = (await searchParams).query?.trim()

  const purchases = await prisma.purchase.findMany({
    where: {
      buyerId: profile.id,
      ...(searchQuery
        ? {
            asset: {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
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
    orderBy: { createdAt: 'desc' },
  })

  return (
    <PageContainer>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight mb-2'>
            My Purchases
          </h1>
          <p className='text-muted-foreground'>
            View and download your purchased AI assets
          </p>
        </div>

        <div className='mt-4 md:mt-0 relative w-full md:w-64'>
          <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
          <form>
            <Input
              placeholder='Search purchases...'
              name='q'
              defaultValue={searchQuery}
              className='pl-9'
            />
          </form>
        </div>
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
              description="You haven't purchased any assets yet. Explore our
                  marketplace to find AI assets that can help you."
              icon={ShoppingBag}
              btnLink={ROUTES.explore()}
              btnText='Explore Assets'
            />
          ) : (
            <div className='space-y-6'>
              {purchases.map((purchase) => (
                <Fragment key={purchase.id}>
                  {purchase.purchaseItems.map((purchasedItem) => (
                    <PurchasedItemCard
                      key={purchase.id}
                      purchasedItem={purchasedItem}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
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
                <Fragment key={purchase.id}>
                  {purchase.purchaseItems.map((purchasedItem) => (
                    <PurchasedItemCard
                      key={purchase.id}
                      purchasedItem={purchasedItem}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
