import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export const AssetDownloadSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className='w-1/2 h-6' />
        </CardTitle>

        <CardDescription>
          <Skeleton className='w-full h-10' />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='space-y-2'>
          <Skeleton className='w-3/4 h-5' />
          <Skeleton className='w-3/4 h-5' />
          <Skeleton className='w-3/4 h-5' />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className='w-full h-10' />
      </CardFooter>
    </Card>
  )
}
