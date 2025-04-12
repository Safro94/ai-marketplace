import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const LicenseSkeleton = () => {
  return (
    <Card className='border-border/50 h-[428px] !mt-0'>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          <div className='flex justify-between'>
            <Skeleton className='w-32 h-7' />
            <Skeleton className='w-40 h-7 rounded-full' />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className='h-6 w-full' />
              </CardTitle>

              <CardDescription>
                <Skeleton className='h-5 w-full' />
              </CardDescription>

              <div className='mt-2 text-2xl font-bold'>
                <Skeleton className='h-8 w-32' />
              </div>
            </CardHeader>

            <CardContent>
              <ul className='space-y-2'>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardFooter className='px-6 pb-6 pt-0 flex flex-col gap-2'>
        <Skeleton className='w-full h-11' />
      </CardFooter>
    </Card>
  )
}
