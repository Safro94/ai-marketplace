import { Skeleton } from '../ui/skeleton'

export const PaypalButtonsSkeleton = () => {
  return (
    <div className='flex flex-col items-center'>
      <Skeleton className='w-full h-[45px] mb-3.5' />
      <Skeleton className='w-full h-[45px] mb-3.5' />
      <Skeleton className='w-28 h-[14px] mb-2.5' />
    </div>
  )
}
