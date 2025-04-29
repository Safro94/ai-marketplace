import { CreatorCTASection } from '@/app/(home)/_components/creator-cta-section'
import { getUserProfile } from '@/data-access/profile'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import type { Metadata } from 'next'
import { CreatorsBenefitsSection } from './_components/creators-benefits-section'
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

export default async function CreatorsPage() {
  const session = await getServerSession()
  let profile

  if (session?.user) {
    profile = await getUserProfile(session.user.id)
  }

  const isCreator = isAdminOrCreator(profile)
  const hasPendingApplication =
    profile?.creatorProfile?.creatorApplication?.status ===
    ApplicationStatus.PENDING

  return (
    <div className='flex flex-col'>
      <CreatorsHeroSection
        isCreator={isCreator}
        hasPendingApplication={hasPendingApplication}
      />
      <CreatorsBenefitsSection />
      <CreatorsHowItWorksSection />
      <CreatorsTypesSection />
      <CreatorsFAQSection />
      <CreatorCTASection
        btnVariant='default'
        classNames={{
          section: 'bg-muted',
          title: 'text-primary',
        }}
      />
    </div>
  )
}
