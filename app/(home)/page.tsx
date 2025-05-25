import type { Metadata } from 'next'
import { AffiliateSection } from './_components/affiliate-section'
import { BenefitsSection } from './_components/benefits-section'
import { CategoriesSection } from './_components/categories-section'
import { CreatorCTASection } from './_components/creator-cta-section'
import { CreatorsSection } from './_components/creators-section'
import { FeaturedSection } from './_components/featured-section'
import { HeroSection } from './_components/hero-section'

export const metadata: Metadata = {
  title: 'GPTs, Prompts, Workflows, AI Tools & AI Artwork  for Everyone',
  description:
    'Discover high-quality AI prompt systems, custom GPTs, AI artwork and specialized tools created by experts. The leading marketplace for AI assets.',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <BenefitsSection />
      <AffiliateSection />
      <CreatorsSection />
      {/* <TestimonialSection /> */}
      <CreatorCTASection />
    </div>
  )
}
