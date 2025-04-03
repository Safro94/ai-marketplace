import { NotFound } from '@/components/not-found'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import { getUserProfile } from '@/lib/db/users'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import { format, formatDistanceToNow } from 'date-fns'
import { Download, ExternalLink, Search, ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LicenseCard } from './license-card'

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

  if (!profile) {
    // Create profile if it doesn't exist
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: user.name || '',
        email: user.email,
        avatarUrl: user.image || '',
      },
    })

    // Redirect to refresh the page
    redirect(ROUTES.purchases())
  }

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
      asset: {
        include: {
          creator: true,
        },
      },
      assetLicense: {
        include: {
          license: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className='container py-12'>
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
            <div className='grid  md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {purchases.map((purchase) => (
                <Card
                  key={purchase.id}
                  className='overflow-hidden flex flex-col'
                >
                  <div className='relative aspect-video w-full overflow-hidden'>
                    <Image
                      src={purchase.asset.featuredImage || '/placeholder.svg'}
                      alt={purchase.asset.title}
                      fill
                      className='object-cover transition-transform hover:scale-105'
                    />
                  </div>

                  <CardHeader className='pb-2'>
                    <CardTitle className='text-xl'>
                      {purchase.asset.title}
                    </CardTitle>

                    <CardDescription className='line-clamp-2'>
                      {purchase.asset.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='flex-1'>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>
                          Purchased:
                        </span>

                        <span>
                          {formatDistanceToNow(new Date(purchase.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Price:</span>
                        <span>${purchase.amount.toFixed(2)}</span>
                      </div>

                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Creator:</span>
                        <span>{purchase.asset.creator.name}</span>
                      </div>
                    </div>

                    <LicenseCard purchase={purchase} />
                  </CardContent>

                  <CardFooter className='flex gap-2'>
                    <Button className='flex-1' asChild>
                      <Link href={purchase.asset.assetFile}>
                        <Download className='mr-2 h-4 w-4' />
                        Download
                      </Link>
                    </Button>

                    <Button variant='outline' size='icon' asChild>
                      <Link href={ROUTES.assetsDetail(purchase.asset.id)}>
                        <ExternalLink className='h-4 w-4' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='recent'>
          {!purchases.length ? (
            <NotFound
              title='No recent purchases'
              description="       You haven't purchased any assets recently. Explore our
                  marketplace to find AI assets that can help you."
              icon={ShoppingBag}
              btnLink={ROUTES.explore()}
              btnText='Explore Assets'
            />
          ) : (
            <div className='space-y-6'>
              {purchases.slice(0, 5).map((purchase) => (
                <Card key={purchase.id}>
                  <div className='flex flex-col md:flex-row'>
                    <div className='relative w-full md:w-48 h-32'>
                      <Image
                        src={purchase.asset.featuredImage || '/placeholder.svg'}
                        alt={purchase.asset.title}
                        fill
                        className='object-cover'
                      />
                    </div>

                    <div className='flex-1 p-6'>
                      <div className='flex flex-col md:flex-row justify-between'>
                        <div>
                          <h3 className='text-xl font-medium mb-2'>
                            {purchase.asset.title}
                          </h3>

                          <p className='text-muted-foreground line-clamp-2 mb-4'>
                            {purchase.asset.description}
                          </p>

                          <div className='flex items-center text-sm text-muted-foreground'>
                            <span>
                              Purchased{' '}
                              {format(new Date(purchase.createdAt), 'PPP')}
                            </span>
                            <span className='mx-2'>•</span>
                            <span>${purchase.amount.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className='mt-4 md:mt-0 flex md:flex-col gap-2 md:justify-center'>
                          <Button size='sm' asChild>
                            <Link href={purchase.asset.assetFile}>
                              <Download className='mr-2 h-4 w-4' />
                              Download
                            </Link>
                          </Button>

                          <Button size='sm' variant='outline' asChild>
                            <Link href={ROUTES.assetsDetail(purchase.asset.id)}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
