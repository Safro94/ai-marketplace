import { PageContainer } from '@/components/page-container'
import { getUserProfile } from '@/data-access/profile'
import { APP_DATA, ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreatorApplicationForm } from './_components/creator-application-form'

export const metadata: Metadata = {
  title: `Apply as Creator | ${APP_DATA.name}`,
  description: `Apply to become a creator on ${APP_DATA.name}`,
}

export default async function CreatorApplicationPage() {
  const { user } = await validateSession()
  const profile = await getUserProfile(user.id)

  const hasPendingApplication =
    profile?.creatorProfile?.creatorApplication?.status ===
    ApplicationStatus.PENDING

  if (hasPendingApplication) redirect(ROUTES.creators())

  return (
    <PageContainer>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Creator Application
        </h1>

        <p className='text-muted-foreground'>
          Fill out the form below to apply as a creator on {APP_DATA.name}
        </p>
      </div>

      {user && <CreatorApplicationForm user={user} />}

      <div className='mt-8 text-center text-sm text-muted-foreground'>
        <p>
          By submitting this application, you agree to our{' '}
          <Link
            href={ROUTES.creatorTerms()}
            className='text-primary underline underline-offset-4'
          >
            Creator Terms
          </Link>{' '}
          and{' '}
          <Link
            href={ROUTES.privacy()}
            className='text-primary underline underline-offset-4'
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </PageContainer>
  )
}
