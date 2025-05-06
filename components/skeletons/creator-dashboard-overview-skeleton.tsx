import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export const CreatorDashboardOverviewSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <Card
          key={i}
          className='flex flex-col bg-background rounded-lg shadow-md transition-all duration-200 hover:shadow-lg'
        >
          <CardHeader className='p-0 pt-4 px-4 flex-row justify-between'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-8 h-8 md:w-10 md:h-10 rounded-full' />
              <Skeleton className='h-7 w-32 mb-1 ' />
            </div>

            <div className='text-right mt-0'>
              <Skeleton className='h-8 w-20' />
            </div>
          </CardHeader>

          <CardContent className='py-2 px-4 flex-1'>
            <Skeleton className='h-5 w-64 mb-4' />
          </CardContent>

          <CardFooter className='p-0 pt-0 pb-4 px-4'>
            <Skeleton className='h-10 w-32' />
          </CardFooter>
        </Card>
      ))}
    </>
  )
}
