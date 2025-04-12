import prisma from '@/lib/prisma'
import { Testimonial } from '@prisma/client'
import { TestimonialsCarousel } from './testimonials-carousel'

const TESTIMONAILS_FALLBACK: Partial<Testimonial>[] = [
  {
    id: '1',
    content:
      "The prompt engineering systems I purchased have completely transformed my content creation process. I'm saving hours each week and producing better results.",
    authorName: 'David Wilson',
    authorRole: 'Content Marketing Manager',
    authorAvatar: '/placeholder.svg?height=80&width=80',
    isPublished: true,
  },

  {
    id: '2',
    content:
      'As a financial advisor, the custom GPT I bought has become an invaluable assistant. It helps me analyze data and generate reports in a fraction of the time.',
    authorName: 'Jennifer Lee',
    authorRole: 'Financial Advisor',
    authorAvatar: '/placeholder.svg?height=80&width=80',
    isPublished: true,
  },
  {
    id: '3',
    content:
      'The industry-specific AI solutions available here are exceptional. I found exactly what I needed for my healthcare practice, and implementation was seamless.',
    authorName: 'Dr. Michael Brown',
    authorRole: 'Healthcare Professional',
    authorAvatar: '/placeholder.svg?height=80&width=80',
    isPublished: true,
  },
]

export const TestimonialSection = async () => {
  const dbTestimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  const testimonials = !!dbTestimonials.length
    ? dbTestimonials
    : TESTIMONAILS_FALLBACK

  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            What Our Users Say
          </h2>
          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            Hear from professionals who have transformed their work with our AI
            assets
          </p>
        </div>

        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
