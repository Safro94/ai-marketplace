import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { AssetStatus } from '@prisma/client'
import { BarChart3, Clock, DollarSign, Upload } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CreatorAnalytics from './creator-analytics'

export const metadata: Metadata = {
  title: 'Creator Dashboard | AIAssets Marketplace',
  description: 'Manage your AI assets and track your sales',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CreatorDashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(`/${ROUTES.login()}?callbackUrl=${ROUTES.creatorDashboard()}`)
  }

  // Check if user is a creator
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !profile.isCreator) {
    redirect(`/${ROUTES.creators}?error=not-creator`)
  }

  // Get creator profile
  const creatorProfile = await prisma.creatorProfile.findUnique({
    where: { profileId: profile.id },
    include: {
      profile: true,
    },
  })

  // Get creator's assets
  const assets = await prisma.asset.findMany({
    where: {
      creatorId: profile.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className='container py-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Creator Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Manage your assets and track your performance
          </p>
        </div>

        <Button className='mt-4 md:mt-0' asChild>
          <Link href={`${ROUTES.creatorDashboardUpload()}`}>
            <Upload className='mr-2 h-4 w-4' />
            Upload New Asset
          </Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='flex items-center'>
              <DollarSign className='h-4 w-4 text-muted-foreground mr-2' />

              <div className='text-2xl font-bold'>
                ${creatorProfile?.totalRevenue.toFixed(2) || '0.00'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Sales
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='flex items-center'>
              <BarChart3 className='h-4 w-4 text-muted-foreground mr-2' />
              <div className='text-2xl font-bold'>
                {creatorProfile?.totalSales || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Pending Reviews
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='flex items-center'>
              <Clock className='h-4 w-4 text-muted-foreground mr-2' />
              <div className='text-2xl font-bold'>
                {
                  assets.filter(
                    (asset) => asset.status === AssetStatus.PENDING_REVIEW,
                  ).length
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='assets'>
        <TabsList className='mb-6'>
          <TabsTrigger value='assets'>My Assets</TabsTrigger>
          <TabsTrigger value='sales'>Sales</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value='assets'>
          {assets.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <p>You have {assets.length} assets</p>
            </div>
          ) : (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <Upload className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No assets yet</h3>

                <p className='text-muted-foreground max-w-md mb-6'>
                  You haven&apos;t uploaded any assets yet. Start sharing your
                  AI expertise with the world!
                </p>

                <Button asChild>
                  <Link href={ROUTES.creatorDashboardUpload()}>
                    <Upload className='mr-2 h-4 w-4' />
                    Upload Your First Asset
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='sales'>
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>
                Track your asset sales and revenue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <DollarSign className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No sales yet</h3>

                <p className='text-muted-foreground max-w-md'>
                  Once you start selling assets, your sales history will appear
                  here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='analytics'>
          <CreatorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
