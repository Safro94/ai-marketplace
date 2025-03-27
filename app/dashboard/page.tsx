import { NotFound } from '@/components/not-found'
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
import { API_ROUTES, ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import { PurchaseStatus } from '@prisma/client'
import { Clock, Download, FileText, Star } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import reviewStar from '../../public/review-star.svg'

enum TabsEnum {
  ASSETS = 'assets',
  DOWNLOADS = 'downloads',
  FAVORITES = 'favorites',
  REVIEWS = 'reviews',
}

export const metadata: Metadata = {
  title: 'User Dashboard | AIAssets Marketplace',
  description: 'Manage your purchased assets and account',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const purchasedAssets = await prisma.purchase.findMany({
    where: {
      buyerId: profile.id,
      status: PurchaseStatus.COMPLETED,
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

        <TabsContent value={TabsEnum.ASSETS}>
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
                      <Link href={`${ROUTES.assets()}/${purchase.asset.id}`}>
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
            <NotFound
              title='No assets yet'
              description="You haven't purchased any assets yet. Browse our marketplace to find AI assets that can help you."
              icon={FileText}
              btnLink={ROUTES.explore()}
              btnText='Browse Marketplace'
            />
          )}
        </TabsContent>

        <TabsContent value={TabsEnum.DOWNLOADS}>
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
                          href={API_ROUTES.assetDownload(download.asset.id)}
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
              <NotFound
                title='No downloads yet'
                description="You haven't downloaded any assets yet. Visit your purchased assets to download them."
                icon={Download}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value={TabsEnum.FAVORITES}>
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
                            <Link
                              href={`${ROUTES.assets()}/${favorite.asset.id}`}
                            >
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
              <NotFound
                title='No favorites yet'
                description="You haven't added any assets to your favorites yet. Browse the marketplace and save assets you're interested in."
                icon={Star}
                btnLink={ROUTES.explore()}
                btnText='Browse Marketplace'
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value={TabsEnum.REVIEWS}>
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
                              <Image
                                key={star}
                                src={reviewStar}
                                width={16}
                                height={16}
                                alt='Review star'
                              />
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
              <NotFound
                title='No reviews yet'
                description="You haven't written any reviews yet. Share your experience with assets you've purchased."
                icon={FileText}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
