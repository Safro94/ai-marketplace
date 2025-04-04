import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'
import { DollarSign, FileText, ShoppingBag, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | AIAssets Marketplace',
  description: 'Manage the AIAssets marketplace',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminDashboardPage() {
  const userCount = await prisma.user.count()
  const assetCount = await prisma.asset.count()
  const salesCount = await prisma.purchase.count()
  const pendingApplicationsCount = await prisma.creatorApplication.count({
    where: { status: ApplicationStatus.PENDING },
  })

  // Calculate total revenue
  const sales = await prisma.purchase.findMany({
    select: {
      amount: true,
    },
  })

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
          },
          {
            cardTitle: 'Total Assets',
            Icon: ShoppingBag,
            cardContent: assetCount,
            cardContentExtra: 'Published assets',
          },
          {
            cardTitle: 'Pending Applications',
            Icon: FileText,
            cardContent: pendingApplicationsCount,
            cardContentExtra: 'Creator applications',
          },
          {
            cardTitle: 'Total Revenue',
            Icon: DollarSign,
            cardContent: `${totalRevenue.toFixed(2)}`,
            cardContentExtra: `${salesCount} sales`,
          },
        ].map(({ cardTitle, Icon, cardContent, cardContentExtra }) => (
          <Card key={cardTitle}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{cardTitle}</CardTitle>
              <Icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>

            <CardContent>
              <div className='text-2xl font-bold'>{cardContent}</div>
              <p className='text-xs text-muted-foreground'>
                {cardContentExtra}
              </p>
            </CardContent>
          </Card>
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
