import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip } from '@/components/ui/tooltip'
import { getAssets } from '@/data-access/assets'
import { getCreatorAnalyticsByCreatorProfileId } from '@/data-access/creator-analytics'
import { getCreatorProfileByProfileId } from '@/data-access/creator-profile'
import { ROUTES, SERVICE_CHARGE } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowRight,
  DollarSign,
  Eye,
  InfoIcon,
  List,
  Package,
  Star,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { validateCreatorDashboardAccess } from './utils'

export default async function CreatorDashboard() {
  const { profile } = await validateCreatorDashboardAccess()

  // Get creator profile
  const creatorProfile = await getCreatorProfileByProfileId(profile.id)

  if (!creatorProfile) {
    redirect(ROUTES.creators())
  }

  // Get creator stats
  const creatorStats = await getCreatorAnalyticsByCreatorProfileId(
    creatorProfile.id,
  )

  // Get assets by status
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

  const totalViews = assets.reduce(
    (sum, asset) => sum + (asset.assetAnalytics?.uniqueViews || 0),
    0,
  )

  const avgRating = assets.length
    ? assets.reduce((sum, a) => sum + a.averageRating, 0) / assets.length
    : 0

  return (
    <PageContainer className='md:p-0 h-full'>
      <div className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold'>Creator Dashboard</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {[
          {
            title: (
              <span className='flex gap-1 items-center'>
                Total Revenue
                <Tooltip
                  content='Total sales - platform commission'
                  trigger={
                    <InfoIcon className='h-4 w-4 text-primary dark:text-primary-foreground cursor-pointer' />
                  }
                />
              </span>
            ),
            value: formatCurrency(
              creatorStats?.totalRevenue
                ? creatorStats.totalRevenue -
                    creatorStats.totalRevenue * SERVICE_CHARGE
                : 0,
            ),
            icon: DollarSign,
            description: 'Your accumulated earnings from all product sales',
          },
          {
            title: 'Total Sales',
            value: `${creatorStats?.totalSales || 0}`,
            icon: Package,
            to: ROUTES.creatorDashboardSales(),
            linkText: 'Go to sales',
            description: 'Number of products sold across all your listings',
          },
          {
            title: 'Total Unique Views',
            value: totalViews,
            icon: Eye,
            description:
              'Total number of unique views across all your product pages',
          },
          {
            title: 'Total Products',
            value: assets.length,
            icon: List,
            to: ROUTES.creatorDashboardAssets(),
            linkText: 'Go to products',
            description: "Number of products you've listed in your store",
          },
          {
            title: 'Avgerage Rating',
            value: (
              <div className='flex items-center'>
                {!avgRating ? '---' : avgRating.toFixed(1)}
                <Star className='h-4 w-4 text-yellow-400 fill-yellow-400 ml-1' />
              </div>
            ),
            icon: Star,
            to: ROUTES.creatorDashboardAssets(),
            linkText: 'Go to products',
            description: 'Average customer rating across all your products',
          },
          {
            title: 'Conversion Rate',
            value: `${
              creatorStats?.totalSales
                ? ((creatorStats.totalSales / totalViews) * 100).toFixed(1)
                : 0
            }%`,
            icon: TrendingUp,
            description: 'Percentage of unique views that convert into sales',
            action: 'See details',
            actionPath: '/analytics/conversion',
          },
        ].map(({ title, value, icon: Icon, linkText, to, description }, i) => (
          <Card
            key={i}
            className='bg-background rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg'
          >
            <div className='flex items-center justify-between mb-2'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-white/10'>
                <span className='text-primary dark:text-primary-foreground'>
                  <Icon className='h-5 w-5 text-primary dark:text-primary-foreground' />
                </span>
              </div>

              <div className='text-right'>
                <span className='text-xl font-bold'>{value}</span>
              </div>
            </div>

            <h3 className='text-lg font-semibold mb-1 text-primary dark:text-primary-foreground'>
              {title}
            </h3>

            <p className='text-gray-400 text-sm mb-4'>{description}</p>

            {to && (
              <Button asChild variant='ghost' className='p-0'>
                <Link href={to}>
                  {linkText}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            )}
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
