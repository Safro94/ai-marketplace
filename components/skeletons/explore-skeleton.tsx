import { Skeleton } from '../ui/skeleton'
import { AssetSkeleton } from './asset-skeleton'

export const ExploreSkeleton = () => {
  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4'>
        <Skeleton className='h-10 w-full md:w-80' />
        <Skeleton className='h-10 w-full md:w-36' />
      </div>

      <div className='flex justify-center md:justify-end mb-2'>
        <Skeleton className='h-5 w-32' />
      </div>

      <div className='grid grid-cols-[repeat(auto-fill, minmax(0,1fr))] md:grid-cols-[repeat(auto-fill,minmax(325px,1fr))] gap-3'>
        {[...Array(8)].map((_, i) => (
          <AssetSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
