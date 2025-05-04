import { DashboardPageContainer } from '@/components/page-container'
import { Card, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <DashboardPageContainer className='h-full' title='Creator Dashboard'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className='bg-background rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg'
          >
            <div className='flex items-center justify-between mb-2'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-white/10'>
                <Skeleton className='h-5 w-5 rounded-full' />
              </div>

              <div className='text-right'>
                <Skeleton className='h-6 w-20' />
              </div>
            </div>

            <Skeleton className='h-7 w-32 mb-1 ' />
            <Skeleton className='h-5 w-64 mb-4' />

            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    </DashboardPageContainer>
  )
}
