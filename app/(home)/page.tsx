import type { Metadata } from 'next'
import { BenefitsSection } from './benefits-section'
import { CategoriesSection } from './categories-section'
import { CreatorCTASection } from './creator-cta-section'
import { FeaturedSection } from './featured-section'
import { HeroSection } from './hero-section'
import { TestimonialSection } from './testimonial-section'

export const metadata: Metadata = {
  title: 'Premium AI Assets Marketplace | Buy and Sell AI Tools and Templates',
  description:
    'Discover high-quality AI prompt systems, custom GPTs, and specialized tools created by experts. The leading marketplace for AI assets.',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <div className='flex flex-col'>
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <BenefitsSection />
      <TestimonialSection />
      <CreatorCTASection />
    </div>
  )
}
