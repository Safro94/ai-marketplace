import { PageContainer } from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <PageContainer className='md:p-0'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Recent Sales</h1>
        <p>Your most recent asset purchases</p>
      </div>

      <Card className='pt-4'>
        <CardContent>
          <div className='flex flex-col gap-4'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='flex flex-col md:flex-row md:items-center gap-4'
              >
                <div className='relative w-full md:w-32 h-24 self-center'>
                  <Skeleton className='w-32 h-24' />
                </div>

                <div className='flex-1 flex flex-col md:flex-row justify-between items-center gap-4'>
                  <div>
                    <Skeleton className='w-40 h-6 mb-1' />
                    <Skeleton className='w-44 h-5' />
                  </div>

                  <Skeleton className='w-14 h-5' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
