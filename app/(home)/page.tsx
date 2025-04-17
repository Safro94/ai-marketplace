import type { Metadata } from 'next'
import { BenefitsSection } from './_components/benefits-section'
import { CategoriesSection } from './_components/categories-section'
import { CreatorCTASection } from './_components/creator-cta-section'
import { FeaturedSection } from './_components/featured-section'
import { HeroSection } from './_components/hero-section'
import { TestimonialSection } from './_components/testimonial-section'

export const metadata: Metadata = {
  title: 'Premium AI market hub | Buy and Sell AI Tools and Templates',
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
