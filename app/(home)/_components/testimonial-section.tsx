import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'
import { getTestimonials } from '@/data-access/testimonials'
import { ComponentProps } from 'react'

const TESTIMONAILS_FALLBACK: ComponentProps<
  typeof InfiniteMovingCards
>['items'] = [
  {
    quote:
      "The prompt engineering systems I purchased have completely transformed my content creation process. I'm saving hours each week and producing better results.",
    name: 'David Wilson',
    title: 'Content Marketing Manager',
    avatar: '/placeholder.svg?height=80&width=80',
  },

  {
    quote:
      'As a financial advisor, the custom GPT I bought has become an invaluable assistant. It helps me analyze data and generate reports in a fraction of the time.',
    name: 'Jennifer Lee',
    title: 'Financial Advisor',
    avatar: '/placeholder.svg?height=80&width=80',
  },
  {
    quote:
      'The industry-specific AI solutions available here are exceptional. I found exactly what I needed for my healthcare practice, and implementation was seamless.',
    name: 'Dr. Michael Brown',
    title: 'Healthcare Professional',
    avatar: '/placeholder.svg?height=80&width=80',
  },
]

export const TestimonialSection = async () => {
  const dbTestimonials = await getTestimonials()

  const testimonials = !!dbTestimonials.length
    ? dbTestimonials.map((item) => ({
        quote: item.content,
        name: item.authorName,
        title: item.authorRole,
        avatar: item.authorAvatar,
      }))
    : TESTIMONAILS_FALLBACK

  return (
    <HomeSection>
      <div className='text-center mb-12'>
        <HomeSectionTitle>Testimonials</HomeSectionTitle>
        <HomeSectionDescription className='mt-2'>
          Hear from professionals who have transformed their work with our AI
          assets
        </HomeSectionDescription>
      </div>

      <InfiniteMovingCards
        items={testimonials}
        direction='right'
        speed='slow'
      />
    </HomeSection>
  )
}
