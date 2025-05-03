import { PageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <PageContainer className='md:p-0'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Affiliate code</h1>
      </div>

      <Card className='pt-4'>
        <CardHeader>
          <CardTitle>Your affiliate code</CardTitle>
          <CardDescription>
            Share this code with your audience to reduce your commision rate.
            You will be able to track your earnings and performance in the
            future.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <Skeleton className='h-8 w-full md:w-44' />
            <Skeleton className='h-10 w-full md:w-40' />
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
