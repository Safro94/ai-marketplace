import { DashboardPageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CREATOR_AFFILIATE_MILESTONES } from '@/lib/constants'

export default function Loading() {
  return (
    <DashboardPageContainer title='Affiliate code'>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl'>Code Details</CardTitle>
            <CardDescription>
              Your active code. Please avoid generating a new code unless it is
              strictly necessary.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col md:flex-row gap-2'>
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
            </div>

            <div className='grid grid-cols-2 gap-4 mt-6'>
              <div className='flex flex-col'>
                <span className='text-sm text-muted-foreground'>
                  Usage Count
                </span>

                <div className='flex items-center'>
                  <Skeleton className='w-10 h-8' />
                </div>
              </div>

              <div className='flex flex-col'>
                <span className='text-sm text-muted-foreground'>
                  Total Sales
                </span>

                <span className='text-2xl font-bold'>
                  <Skeleton className='w-20 h-8' />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl'>Milestone Progress</CardTitle>
            <CardDescription>
              <Skeleton className='w-full h-5' />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='space-y-6'>
              <Skeleton className='h-3 w-full' />

              <div className='flex justify-between'>
                {CREATOR_AFFILIATE_MILESTONES.map((_, index) => (
                  <div key={index} className='flex flex-col items-center'>
                    <Skeleton className='w-4 h-4 rounded-full mb-1' />
                    <Skeleton className='h-4 w-10' />
                  </div>
                ))}
              </div>

              <Skeleton className='mt-4 h-[44px]' />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageContainer>
  )
}
