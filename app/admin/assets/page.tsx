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
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { ModerationService } from '@/services/ModerationService'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ModerationActions } from './moderation-actions'

export default async function ModerationPage() {
  const session = await getServerSession()

  if (!session?.user) redirect(ROUTES.login())

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id, isAdmin: true },
    select: { isAdmin: true },
  })

  if (!profile?.isAdmin) redirect(ROUTES.home())

  const pendingAssets = await ModerationService.getPendingAssets(20, 0)

  return (
    <div className='container py-10'>
      <h1 className='text-3xl font-bold mb-6'>Content Moderation</h1>

      <Tabs defaultValue='pending'>
        <TabsList className='mb-6'>
          <TabsTrigger value='pending'>
            Pending Review ({pendingAssets.length})
          </TabsTrigger>
          {/* <TabsTrigger value='history'>Moderation History</TabsTrigger> */}
        </TabsList>

        <TabsContent value='pending'>
          {!pendingAssets.length ? (
            <div className='text-center py-12 bg-muted rounded-lg'>
              <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
              <h2 className='text-xl font-medium mb-2'>All caught up!</h2>
              <p className='text-muted-foreground'>
                There are no assets pending review.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6'>
              {pendingAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle>{asset.title}</CardTitle>
                        <CardDescription>
                          By {asset.creator.name} • Submitted{' '}
                          {format(new Date(asset.createdAt), 'PPP')}
                        </CardDescription>
                      </div>

                      <Badge variant='outline' className='border-yellow-300'>
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      <div>
                        {asset.featuredImage ? (
                          <div className='relative aspect-video rounded-md overflow-hidden'>
                            <Image
                              src={asset.featuredImage || '/placeholder.svg'}
                              alt={asset.title}
                              fill
                              className='object-cover'
                            />
                          </div>
                        ) : (
                          <div className='aspect-video bg-muted rounded-md flex items-center justify-center'>
                            <AlertCircle className='h-8 w-8 text-muted-foreground' />
                          </div>
                        )}
                      </div>

                      <div className='md:col-span-2 space-y-4'>
                        <div>
                          <h3 className='text-sm font-medium mb-1'>
                            Description
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            {asset.description}
                          </p>
                        </div>

                        <div>
                          <h3 className='text-sm font-medium mb-1'>Features</h3>
                          <ul className='list-disc list-inside text-sm text-muted-foreground'>
                            {asset.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </div>

                        {asset.moderationNotes && (
                          <div>
                            <h3 className='text-sm font-medium mb-1'>
                              Auto-moderation Notes
                            </h3>
                            <p className='text-sm text-yellow-600'>
                              {asset.moderationNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className='flex justify-between'>
                    <Button variant='outline' asChild>
                      <Link
                        href={`${ROUTES.assets()}/${asset.id}`}
                        target='_blank'
                      >
                        View Details
                      </Link>
                    </Button>

                    <ModerationActions
                      assetId={asset.id}
                      isFeatured={asset.featured}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* <TabsContent value='history'>
          <div className='text-center py-12 bg-muted rounded-lg'>
            <p className='text-muted-foreground'>
              Moderation history will be available in a future update.
            </p>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
