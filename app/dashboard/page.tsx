import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Download, FileText, Star } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'User Dashboard | AIAssets Marketplace',
  description: 'Manage your purchased assets and account',
  robots: {
    index: false,
    follow: false,
  },
}

// Mock data for purchased assets
const purchasedAssets = [
  {
    id: 1,
    title: 'Advanced SEO Content Generation System',
    description:
      'A comprehensive prompt system for creating SEO-optimized content that ranks.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Prompt Engineering',
    purchaseDate: '2024-03-15',
    downloadCount: 3,
  },
  {
    id: 2,
    title: 'Financial Advisor GPT',
    description:
      'Custom GPT trained to provide financial advice and investment strategies.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Custom GPTs',
    purchaseDate: '2024-03-10',
    downloadCount: 1,
  },
]

export default function DashboardPage() {
  return (
    <div className='container py-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Manage your purchased assets and account
          </p>
        </div>
        <Button className='mt-4 md:mt-0' variant='outline' asChild>
          <Link href='/explore'>Browse More Assets</Link>
        </Button>
      </div>

      <Tabs defaultValue='assets'>
        <TabsList className='mb-6'>
          <TabsTrigger value='assets'>My Assets</TabsTrigger>
          <TabsTrigger value='downloads'>Download History</TabsTrigger>
          <TabsTrigger value='favorites'>Favorites</TabsTrigger>
          <TabsTrigger value='reviews'>My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value='assets'>
          {purchasedAssets.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {purchasedAssets.map((asset) => (
                <Card key={asset.id} className='overflow-hidden'>
                  <div className='relative aspect-[4/3] w-full'>
                    <Image
                      src={asset.image || '/placeholder.svg'}
                      alt={asset.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <Badge variant='secondary' className='mb-2'>
                        {asset.category}
                      </Badge>
                      <div className='flex items-center text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3 mr-1' />
                        Purchased: {asset.purchaseDate}
                      </div>
                    </div>
                    <CardTitle className='text-xl'>{asset.title}</CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {asset.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className='flex justify-between'>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/assets/${asset.id}`}>View Details</Link>
                    </Button>
                    <Button size='sm'>
                      <Download className='h-4 w-4 mr-2' />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <FileText className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No assets yet</h3>
                <p className='text-muted-foreground max-w-md mb-6'>
                  You haven&apos;t purchased any assets yet. Browse our
                  marketplace to find AI assets that can help you.
                </p>
                <Button asChild>
                  <Link href='/explore'>Browse Marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='downloads'>
          <Card>
            <CardHeader>
              <CardTitle>Download History</CardTitle>
              <CardDescription>Track your asset downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {purchasedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className='flex items-center justify-between border-b pb-4 last:border-0'
                  >
                    <div className='flex items-center'>
                      <div className='relative h-12 w-12 rounded overflow-hidden mr-4'>
                        <Image
                          src={asset.image || '/placeholder.svg'}
                          alt={asset.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div>
                        <h4 className='font-medium'>{asset.title}</h4>
                        <p className='text-xs text-muted-foreground'>
                          Downloaded {asset.downloadCount} times
                        </p>
                      </div>
                    </div>
                    <Button size='sm'>
                      <Download className='h-4 w-4 mr-2' />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='favorites'>
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <Star className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No favorites yet</h3>
              <p className='text-muted-foreground max-w-md mb-6'>
                You haven&apos;t added any assets to your favorites yet. Browse
                the marketplace and save assets you&apos;re interested in.
              </p>
              <Button asChild>
                <Link href='/explore'>Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='reviews'>
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <FileText className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No reviews yet</h3>
              <p className='text-muted-foreground max-w-md mb-6'>
                You haven&apos;t written any reviews yet. Share your experience
                with assets you&apos;ve purchased.
              </p>
              <Button asChild>
                <Link href='/dashboard?tab=assets'>View My Assets</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
