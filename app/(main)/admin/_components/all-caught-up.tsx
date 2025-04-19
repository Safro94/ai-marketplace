import { CheckCircle } from 'lucide-react'

export const AllCaughtUp = () => {
  return (
    <div className='text-center py-12 bg-muted rounded-lg'>
      <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
      <h2 className='text-xl font-medium mb-2'>All caught up!</h2>
      <p className='text-muted-foreground'>
        There are no items pending review.
      </p>
    </div>
  )
}
