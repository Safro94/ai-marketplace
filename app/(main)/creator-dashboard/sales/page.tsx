import { PageContainer } from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { getUserProfile } from '@/data-access/profile'
import { getAllCreatorDashboardPurchasesByAssetCreator } from '@/data-access/purchases'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { user } = await validateSession(ROUTES.creatorDashboard())
  const profile = await getUserProfile(user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  // Get recent sales
  const recentSales = await getAllCreatorDashboardPurchasesByAssetCreator(
    profile.id,
  )

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
              {recentSales.map((sale) => {
                return sale.purchaseItems.map((item) => (
                  <Link
                    key={item.id}
                    href={ROUTES.assetsDetail(item.assetId)}
                    className='font-medium'
                    target='_blank'
                  >
                    <div className='flex flex-col md:flex-row md:items-center gap-4'>
                      <div className='relative w-full md:w-32 h-24 self-center'>
                        <Image
                          src={item.asset.featuredImage || '/placeholder.svg'}
                          alt={item.asset.title}
                          fill
                          className='object-contain'
                        />
                      </div>

                      <div className='flex-1 flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div>
                          <h3 className='text-md font-medium'>
                            {item.asset.title}
                          </h3>

                          <p className='text-muted-foreground text-sm'>
                            {item.assetLicense?.license.name} •{' '}
                            {format(new Date(item.createdAt), 'MMM d')}
                          </p>
                        </div>

                        <span className='font-bold'>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
