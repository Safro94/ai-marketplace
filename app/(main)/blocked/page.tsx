import { PageContainer } from '@/components/page-container'
import { ShieldX } from 'lucide-react'

export default function BlockedPage() {
  return (
    <PageContainer className='py-0 h-full flex items-center justify-center'>
      <div className='max-w-lg w-full text-center space-y-6 '>
        <div className='flex justify-center'>
          <div className='bg-red-500/10 border border-red-500/20 rounded-full p-6'>
            <ShieldX className='h-12 w-12 text-red-500' />
          </div>
        </div>
        <h1 className='text-3xl font-bold'>You&apos;re Temporarily Blocked</h1>
        <p className='text-gray-400'>
          You&apos;ve attempted to access this page too many times in a short
          period and have been temporarily blocked for security reasons.
        </p>
        <p className='text-gray-500 text-sm'>
          If you believe this was a mistake, please contact support or try again
          later.
        </p>
      </div>
    </PageContainer>
  )
}
