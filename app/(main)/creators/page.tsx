import { getUserProfile } from '@/data-access/profile'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import { AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { CreatorsBenefitsSection } from './_components/creators-benefits-section'
import { CreatorsCTASection } from './_components/creators-cta-section'
import { CreatorsFAQSection } from './_components/creators-faq-section'
import { CreatorsHeroSection } from './_components/creators-hero-section'
import { CreatorsHowItWorksSection } from './_components/creators-how-it-works-section'
import { CreatorsTypesSection } from './_components/creators-types-section'

export const metadata: Metadata = {
  title: 'Become a Creator | Sell Your AI Assets',
  description:
    'Join our marketplace as a creator and sell your AI assets to professionals worldwide. Turn your expertise into a sustainable revenue stream.',
  alternates: {
    canonical: '/creators',
  },
  openGraph: {
    title: 'Become a Creator | Sell Your AI Assets',
    description:
      'Join our marketplace as a creator and sell your AI assets to professionals worldwide. Turn your expertise into a sustainable revenue stream.',
    url: '/creators',
  },
}

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { user } = await validateSession()
  const profile = await getUserProfile(user.id)

  const isCreator = isAdminOrCreator(profile)
  const hasPendingApplication =
    profile?.creatorProfile?.creatorApplication?.status ===
    ApplicationStatus.PENDING

  const error = (await searchParams).error

  return (
    <div className='flex flex-col'>
      {/* Error message if needed */}
      {error === 'not-creator' && (
        <div className='bg-destructive/15 border-l-4 border-destructive p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <AlertCircle
                className='h-5 w-5 text-destructive'
                aria-hidden='true'
              />
            </div>

            <div className='ml-3'>
              <p className='text-sm text-destructive'>
                You need to be an approved creator to access the creator
                dashboard. Please apply below.
              </p>
            </div>
          </div>
        </div>
      )}

      <CreatorsHeroSection
        isCreator={isCreator}
        hasPendingApplication={hasPendingApplication}
      />
      <CreatorsBenefitsSection />
      <CreatorsHowItWorksSection />
      <CreatorsTypesSection />
      <CreatorsFAQSection />
      {!isCreator && <CreatorsCTASection />}
    </div>
  )
}
