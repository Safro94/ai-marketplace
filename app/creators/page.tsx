import type { Metadata } from 'next'
import { CreatorsBenefitsSection } from './creators-benefits-section'
import { CreatorsCTASection } from './creators-cta-section'
import { CreatorsFAQSection } from './creators-faq-section'
import { CreatorsHeroSection } from './creators-hero-section'
import { CreatorsHowItWorksSection } from './creators-how-it-works-section'
import { CreatorsTypesSection } from './creators-types-section'

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

export default function CreatorsPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <CreatorsHeroSection />
      <CreatorsBenefitsSection />
      <CreatorsHowItWorksSection />
      <CreatorsTypesSection />
      <CreatorsFAQSection />
      <CreatorsCTASection />
    </div>
  )
}
