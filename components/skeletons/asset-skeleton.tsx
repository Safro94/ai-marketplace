import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export const AssetSkeleton = () => {
  return (
    <Card className='overflow-hidden shadow-md grid gap-2 h-[375px]'>
      <div className='flex-1 grid grid-rows-[200px,1fr]'>
        <CardHeader className='p-0 block relative w-full'>
          <Skeleton className='w-full h-[200px]' />
        </CardHeader>

        <CardContent className='p-2 grid'>
          <div className='grid grid-cols-[70%_1fr] gap-4 overflow-hidden'>
            <div>
              <Skeleton className='w-3/4 h-[28px]' />
              <Skeleton className='w-3/4 h-4' />
            </div>

            <Skeleton className='w-full h-[28px] justify-self-end' />
          </div>

          <div className='flex justify-between mt-auto'>
            <Skeleton className='w-2/4 h-5' />
            <Skeleton className='w-1/4 h-5' />
          </div>
        </CardContent>

        <CardFooter className='p-2'>
          <Skeleton className='h-10 w-full' />
        </CardFooter>
      </div>
    </Card>
  )
}
