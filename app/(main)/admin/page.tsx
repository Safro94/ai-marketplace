import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAssetCount } from '@/data-access/assets'
import { getPendingCreatorApplicationsCount } from '@/data-access/creator-application'
import { getPurchasesAmount, getPurchasesCount } from '@/data-access/purchases'
import { getUserCount } from '@/data-access/users'
import { APP_DATA, ROUTES, SERVICE_CHARGE } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, FileText, ShoppingBag, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Admin Dashboard | ${APP_DATA.name}`,
  description: `Manage the ${APP_DATA.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminDashboardPage() {
  const userCount = await getUserCount()
  const assetCount = await getAssetCount()
  const salesCount = await getPurchasesCount()
  const sales = await getPurchasesAmount()
  const pendingApplicationsCount = await getPendingCreatorApplicationsCount()

  const totalRevenue = sales.reduce((total, sale) => total + sale.amount, 0)

  return (
    <PageContainer>
      <h1 className='text-3xl font-bold tracking-tight mb-8'>
        Admin Dashboard
      </h1>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        {[
          {
            cardTitle: 'Total Users',
            Icon: Users,
            cardContent: userCount,
            cardContentExtra: 'Registered users',
            link: ROUTES.adminUsers(),
          },
          {
            cardTitle: 'Total Assets',
            Icon: ShoppingBag,
            cardContent: assetCount,
            cardContentExtra: 'Published assets',
            link: ROUTES.adminAssets(),
          },
          {
            cardTitle: 'Pending Applications',
            Icon: FileText,
            cardContent: pendingApplicationsCount,
            cardContentExtra: 'Creator applications',
            link: ROUTES.adminCreatorApplications(),
          },
          {
            cardTitle: 'Total Revenue',
            Icon: DollarSign,
            cardContent: formatCurrency(totalRevenue * SERVICE_CHARGE),
            cardContentExtra: `${salesCount} sales`,
          },
        ].map(({ cardTitle, link, Icon, cardContent, cardContentExtra }, i) => (
          <Link href={link ?? '#'} key={i}>
            <Card className='card-hover'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {cardTitle}
                </CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>

              <CardContent>
                <div className='text-2xl font-bold'>{cardContent}</div>
                <p className='text-xs text-muted-foreground'>
                  {cardContentExtra}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Overview of recent platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Recent activity will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generated reports and exports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </PageContainer>
  )
}
