import { Skeleton } from '../ui/skeleton'

export const PaypalButtonsSkeleton = () => {
  return (
    <div className='flex flex-col items-center'>
      <Skeleton className='w-full h-[45px] mb-3.5 rounded-full' />
      <Skeleton className='w-full h-[45px] mb-3.5 rounded-full' />
      <Skeleton className='w-28 h-3 mb-0.5 rounded-full' />
    </div>
  )
}
