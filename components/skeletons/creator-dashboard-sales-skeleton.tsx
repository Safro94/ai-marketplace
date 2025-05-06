import { Skeleton } from '../ui/skeleton'

export const CreatorDashboardSalesSkeleton = () => {
  return (
    <div className='flex flex-col gap-4'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='flex flex-col md:flex-row md:items-center gap-4'
        >
          <div className='relative h-24 w-48 self-center flex-shrink-0'>
            <Skeleton className='h-24 w-48' />
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
  )
}
