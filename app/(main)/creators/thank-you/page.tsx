import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { APP_DATA } from '@/lib/constants'
import { CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Application Submitted | ${APP_DATA.name}`,
  description: `Thank you for applying to become a creator on ${APP_DATA.name}`,
}

const NEXT_STEPS = [
  'Our team will review your application (typically within 2-3 business days)',
  "You'll receive an email notification with our decision",
  "If approved, you'll gain access to the creator dashboard where you can start uploading assets",
]

export default function ThankYouPage() {
  return (
    <PageContainer>
      <div className='max-w-2xl mx-auto text-center'>
        <div className='flex justify-center mb-6'>
          <div className='h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center'>
            <CheckCircle className='h-12 w-12 text-primary' />
          </div>
        </div>

        <h1 className='text-3xl font-bold tracking-tight mb-4'>
          Application Submitted!
        </h1>

        <p className='text-xl text-muted-foreground mb-8'>
          Thank you for applying to become a creator on {APP_DATA.name}.
          We&apos;ve received your application and will review it shortly.
        </p>

        <div className='bg-secondary/30 rounded-lg p-6 mb-8'>
          <h2 className='text-lg font-medium mb-2'>What happens next?</h2>
          <ol className='text-left space-y-2 text-muted-foreground'>
            {NEXT_STEPS.map((text, i) => (
              <li key={text} className='flex items-start'>
                <span className='font-medium mr-2'>{i}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button asChild>
            <Link href='/'>Return to Homepage</Link>
          </Button>

          <Button variant='outline' asChild>
            <Link href='/explore'>Explore Marketplace</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
