import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const CLASSNAME = 'w-full h-4'

export const AssetGridSkeleton = () => {
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6'>
      {[1, 2, 3, 4].map((asset) => (
        <Card key={asset} className='overflow-hidden border'>
          <CardHeader className='p-0'>
            <div className='relative aspect-[4/3] w-full overflow-hidden'>
              <Skeleton className={cn(CLASSNAME, 'h-52')} />
            </div>
          </CardHeader>

          <CardContent className='p-4'>
            <div className='flex items-center justify-between mb-3'>
              <Skeleton className={CLASSNAME} />
              <Skeleton className={CLASSNAME} />
            </div>

            <div className='mb-2'>
              <Skeleton className={CLASSNAME} />
            </div>

            <div className='mb-4'>
              <Skeleton className={CLASSNAME} />
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Skeleton className={CLASSNAME} />

                <span>
                  <Skeleton className={CLASSNAME} />
                </span>
              </div>

              <div className='flex items-center'>
                <Skeleton className={CLASSNAME} />

                <div>
                  <Skeleton className={CLASSNAME} />
                </div>

                <div className='ml-1'>
                  <Skeleton className={CLASSNAME} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
