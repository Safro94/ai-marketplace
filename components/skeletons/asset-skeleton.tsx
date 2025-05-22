import { Skeleton } from '../ui/skeleton'

export const AssetSkeleton = () => {
  return (
    <div className='relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
      <div className='aspect-video overflow-hidden'>
        <Skeleton className='w-full h-[200px]' />
      </div>

      <div className='p-3'>
        <div className='flex items-center justify-between mb-2'>
          <Skeleton className='w-1/2 h-7' />

          <div className='flex items-center'>
            <Skeleton className='w-16 h-7' />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='w-14 h-4' />
        </div>
      </div>
    </div>
  )
}
