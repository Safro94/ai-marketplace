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
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import { Clock, Download, FileText, Star } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'User Dashboard | AIAssets Marketplace',
  description: 'Manage your purchased assets and account',
  robots: {
    index: false,
    follow: false,
  },
}

export const DashboardPage = async () => {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    redirect('/login?callbackUrl=/dashboard')
  }

  // Get user's purchased assets
  const purchasedAssets = await prisma.purchase.findMany({
    where: {
      buyerId: profile.id,
      status: 'COMPLETED',
    },
    include: {
      asset: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get user's download history
  const downloadHistory = await prisma.download.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      asset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get user's favorites
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      asset: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get user's reviews
  const reviews = await prisma.review.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      asset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

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
              {purchasedAssets.map((purchase) => (
                <Card key={purchase.id} className='overflow-hidden'>
                  <div className='relative aspect-[4/3] w-full'>
                    <Image
                      src={
                        purchase.asset.featuredImage ||
                        '/placeholder.svg?height=400&width=600'
                      }
                      alt={purchase.asset.title}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <Badge variant='secondary' className='mb-2'>
                        {purchase.asset.category.name}
                      </Badge>

                      <div className='flex items-center text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3 mr-1' />
                        Purchased: {formatDate(purchase.createdAt)}
                      </div>
                    </div>

                    <CardTitle className='text-xl'>
                      {purchase.asset.title}
                    </CardTitle>

                    <CardDescription className='line-clamp-2'>
                      {purchase.asset.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className='flex justify-between'>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/assets/${purchase.asset.id}`}>
                        View Details
                      </Link>
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
                  You haven't purchased any assets yet. Browse our marketplace
                  to find AI assets that can help you.
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
            {downloadHistory.length > 0 ? (
              <CardContent className='py-6'>
                <div className='space-y-4'>
                  {downloadHistory.map((download) => (
                    <div
                      key={download.id}
                      className='flex items-center justify-between border-b pb-4 last:border-0'
                    >
                      <div className='flex items-center'>
                        <div className='relative h-12 w-12 rounded overflow-hidden mr-4'>
                          <Image
                            src={
                              download.asset.featuredImage ||
                              '/placeholder.svg?height=80&width=80'
                            }
                            alt={download.asset.title}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div>
                          <h4 className='font-medium'>
                            {download.asset.title}
                          </h4>
                          <p className='text-xs text-muted-foreground'>
                            Downloaded on {formatDate(download.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button size='sm' asChild>
                        <Link
                          href={`/api/assets/${download.asset.id}/download`}
                        >
                          <Download className='h-4 w-4 mr-2' />
                          Download
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <Download className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No downloads yet</h3>
                <p className='text-muted-foreground max-w-md mb-6'>
                  You haven't downloaded any assets yet. Visit your purchased
                  assets to download them.
                </p>
                <Button asChild>
                  <Link href='/dashboard?tab=assets'>View My Assets</Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='favorites'>
          <Card>
            {favorites.length > 0 ? (
              <CardContent className='py-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {favorites.map((favorite) => (
                    <Card key={favorite.id} className='overflow-hidden'>
                      <div className='relative aspect-[4/3] w-full'>
                        <Image
                          src={
                            favorite.asset.featuredImage ||
                            '/placeholder.svg?height=400&width=600'
                          }
                          alt={favorite.asset.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <CardContent className='p-4'>
                        <Badge variant='secondary' className='mb-2'>
                          {favorite.asset.category.name}
                        </Badge>
                        <h3 className='font-medium mb-1'>
                          {favorite.asset.title}
                        </h3>
                        <p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
                          {favorite.asset.description}
                        </p>
                        <div className='flex justify-between items-center'>
                          <span className='font-bold'>
                            ${favorite.asset.price}
                          </span>
                          <Button size='sm' asChild>
                            <Link href={`/assets/${favorite.asset.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <Star className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No favorites yet</h3>
                <p className='text-muted-foreground max-w-md mb-6'>
                  You haven&apos;t added any assets to your favorites yet.
                  Browse the marketplace and save assets you&apos;re interested
                  in.
                </p>
                <Button asChild>
                  <Link href='/explore'>Browse Marketplace</Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='reviews'>
          <Card>
            {reviews.length > 0 ? (
              <CardContent className='py-6'>
                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className='border-b pb-6 last:border-0'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <h4 className='font-medium'>{review.asset.title}</h4>
                          <div className='flex mt-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                                fill={
                                  star <= review.rating
                                    ? 'currentColor'
                                    : 'none'
                                }
                                stroke='currentColor'
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500' : 'text-muted-foreground'}`}
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <h5 className='font-medium mb-1'>{review.title}</h5>
                      <p className='text-sm text-muted-foreground'>
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <FileText className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No reviews yet</h3>
                <p className='text-muted-foreground max-w-md mb-6'>
                  You haven&apos;t written any reviews yet. Share your
                  experience with assets you&apos;ve purchased.
                </p>
                <Button asChild>
                  <Link href='/dashboard?tab=assets'>View My Assets</Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
