import CreatorCTASection from '@/app/(home)/creator-cta-section'
import TestimonialSection from '@/app/(home)/testimonial-section'
import type { Metadata } from 'next'
import { BenefitsSection } from './benefits-section'
import { CategoriesSection } from './categories-section'
import { FeaturedSection } from './featured-section'
import { HeroSection } from './hero-section'

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
    <div className='flex flex-col min-h-screen'>
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <BenefitsSection />
      <TestimonialSection />
      <CreatorCTASection />
    </div>
  )
}
