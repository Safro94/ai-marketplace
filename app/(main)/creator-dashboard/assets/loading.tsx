import { DashboardPageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'

export default function Loading() {
  return (
    <DashboardPageContainer
      customHeader={
        <div className='mb-8 flex flex-col gap-4 md:flex-row md:justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Products</h1>
            <p>Manage and monitor your products</p>
          </div>

          <Button asChild className='w-fit'>
            <Link href={ROUTES.creatorDashboardUpload()}>
              Upload New Product
            </Link>
          </Button>
        </div>
      }
    >
      <Card className='pt-4'>
        <CardContent>
          <Tabs defaultValue='all'>
            <TabsList className='mb-4'>
              <TabsTrigger value='all'>
                <Skeleton className='h-6 w-16' />
              </TabsTrigger>

              <TabsTrigger value='published'>
                <Skeleton className='h-6 w-24' />
              </TabsTrigger>

              <TabsTrigger value='pending'>
                <Skeleton className='h-6 w-24' />
              </TabsTrigger>

              <TabsTrigger value='rejected'>
                <Skeleton className='h-6 w-24' />
              </TabsTrigger>
            </TabsList>

            <div className='flex flex-col gap-4'>
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className='p-4'>
                    <div className='flex flex-col items-center justify-center gap-2 md:flex-row space-x-4'>
                      <div className='relative h-24 w-48 self-center flex-shrink-0'>
                        <Skeleton className='h-24 w-48' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <Skeleton className='w-32 h-5' />

                        <div className='flex flex-wrap justify-center md:justify-start items-center space-x-4 mt-2 text-sm text-muted-foreground'>
                          <div className='flex items-center'>
                            <Skeleton className='w-7 h-5' />
                          </div>

                          <div className='flex items-center'>
                            <Skeleton className='w-10 h-5' />
                          </div>

                          <div className='flex items-center'>
                            <Skeleton className='w-16 h-5' />
                          </div>

                          <div>
                            <Skeleton className='w-20 h-5' />
                          </div>
                        </div>
                      </div>

                      <Skeleton className='w-32 h-5' />

                      <div className='flex items-center space-x-2'>
                        <Skeleton className='w-[57px] h-9' />
                        <Skeleton className='w-8 h-9' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardPageContainer>
  )
}
