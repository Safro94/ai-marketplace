import { Skeleton } from '@/components/ui/skeleton'

export const CartItemSkeleton = () => (
  <div className='flex items-center space-x-4'>
    <Skeleton className='w-16 h-16' />

    <div className='flex-1'>
      <Skeleton className='w-full h-5 mb-1' />
      <Skeleton className='w-full h-5' />
    </div>
  </div>
)
