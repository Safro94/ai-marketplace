import type { Metadata } from 'next'
import Link from 'next/link'
import { CreatorApplicationForm } from './creator-application-form'

export const metadata: Metadata = {
  title: 'Apply as Creator | AIAssets Marketplace',
  description: 'Apply to become a creator on AIAssets Marketplace',
}

export default function CreatorApplicationPage() {
  return (
    <div className='container py-12'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight mb-2'>
            Creator Application
          </h1>
          <p className='text-muted-foreground'>
            Fill out the form below to apply as a creator on AIAssets
            Marketplace
          </p>
        </div>

        <CreatorApplicationForm />

        <div className='mt-8 text-center text-sm text-muted-foreground'>
          <p>
            By submitting this application, you agree to our{' '}
            <Link
              href='/creator-terms'
              className='text-primary underline underline-offset-4'
            >
              Creator Terms
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
