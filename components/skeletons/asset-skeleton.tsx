import { Skeleton } from '../ui/skeleton'

export const AssetSkeleton = () => {
  return (
    <div className='relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
      <div className='aspect-video overflow-hidden'>
        <Skeleton className='w-full h-[200px]' />
      </div>

      <div className='absolute top-3 left-3'>
        <Skeleton className='w-3/4 h-[22px]' />
      </div>

      <div className='p-5'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-5 w-28' />
          </div>

          <div className='flex items-center'>
            <Skeleton className='w-5 h-5 rounded-full' />
            <Skeleton className='w-10 h-5' />
          </div>
        </div>

        <Skeleton className='w-1/2 h-[28px] mb-1' />
        <Skeleton className='w-full h-10 mb-4' />

        <div className='flex items-center justify-between'>
          <Skeleton className='w-1/4 h-[28px]' />
          <Skeleton className='h-[36px] w-1/2 rounded-full' />
        </div>
      </div>
    </div>
  )
}
