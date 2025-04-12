import { PageContainer } from '@/components/page-container'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateAdminProfile } from '@/lib/db/permissions'
import { ModerationService } from '@/services/ModerationService'
import { format } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { AllCaughtUp } from '../_components/all-caught-up'
import { ModerationActions } from './_components/moderation-actions'

export default async function ModerationPage() {
  await validateAdminProfile()

  const pendingAssets = await ModerationService.getPendingAssets(20, 0)

  return (
    <PageContainer>
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
            <AllCaughtUp />
          ) : (
            <div className='grid gap-6'>
              {pendingAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle>{asset.title}</CardTitle>
                        <CardDescription>
                          By {asset.creator.user.name} • Submitted{' '}
                          {format(new Date(asset.createdAt), 'PPP')}
                        </CardDescription>
                      </div>

                      <Badge variant='outline' className='border-yellow-300'>
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className='grid  md:grid-cols-3 gap-6'>
                      <div>
                        {asset.featuredImage ? (
                          <div className='relative aspect-video rounded-md overflow-hidden'>
                            <Image
                              src={asset.featuredImage || '/placeholder.svg'}
                              alt={asset.title}
                              fill
                              className='object-cover'
                              priority
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

                  <CardFooter>
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
    </PageContainer>
  )
}
