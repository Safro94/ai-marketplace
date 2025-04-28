import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_DATA, ROUTES } from '@/lib/constants'
import { Metadata } from 'next'
import Link from 'next/link'

enum TabsEnum {
  ASSETS = 'assets',
  DOWNLOADS = 'downloads',
  FAVORITES = 'favorites',
  REVIEWS = 'reviews',
}

export const metadata: Metadata = {
  title: `User Dashboard | ${APP_DATA.name}`,
  description: 'Manage your purchased assets and account',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({
  children,
  downloads,
  reviews,
  favorites,
}: {
  children: React.ReactNode
  downloads: React.ReactNode
  reviews: React.ReactNode
  favorites: React.ReactNode
}) {
  return (
    <PageContainer>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Manage your purchased assets and account
          </p>
        </div>

        <Button className='mt-4 md:mt-0' variant='outline' asChild>
          <Link href={ROUTES.explore()}>Browse More Assets</Link>
        </Button>
      </div>

      <Tabs defaultValue={TabsEnum.ASSETS}>
        <TabsList className='mb-6'>
          <TabsTrigger value={TabsEnum.ASSETS}>My Purchased Assets</TabsTrigger>
          <TabsTrigger value={TabsEnum.DOWNLOADS}>Download History</TabsTrigger>
          <TabsTrigger value={TabsEnum.FAVORITES}>Favorites</TabsTrigger>
          <TabsTrigger value={TabsEnum.REVIEWS}>My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value={TabsEnum.ASSETS}>{children}</TabsContent>
        <TabsContent value={TabsEnum.DOWNLOADS}>{downloads}</TabsContent>
        <TabsContent value={TabsEnum.FAVORITES}>{favorites}</TabsContent>
        <TabsContent value={TabsEnum.REVIEWS}>{reviews}</TabsContent>
      </Tabs>
    </PageContainer>
  )
}
