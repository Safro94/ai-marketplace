import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Try to fetch testimonials from the database
    const dbTestimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // If we have testimonials in the database, return them
    if (dbTestimonials.length > 0) {
      return NextResponse.json(dbTestimonials)
    }

    // Otherwise, return hardcoded testimonials
    // This is a fallback until we have real testimonials in the database
    const fallbackTestimonials = [
      {
        id: 1,
        content:
          "The prompt engineering systems I purchased have completely transformed my content creation process. I'm saving hours each week and producing better results.",
        author: {
          name: 'David Wilson',
          role: 'Content Marketing Manager',
          avatar: '/placeholder.svg?height=80&width=80',
        },
      },
      {
        id: 2,
        content:
          'As a financial advisor, the custom GPT I bought has become an invaluable assistant. It helps me analyze data and generate reports in a fraction of the time.',
        author: {
          name: 'Jennifer Lee',
          role: 'Financial Advisor',
          avatar: '/placeholder.svg?height=80&width=80',
        },
      },
      {
        id: 3,
        content:
          'The industry-specific AI solutions available here are exceptional. I found exactly what I needed for my healthcare practice, and implementation was seamless.',
        author: {
          name: 'Dr. Michael Brown',
          role: 'Healthcare Professional',
          avatar: '/placeholder.svg?height=80&width=80',
        },
      },
    ]

    return NextResponse.json(fallbackTestimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 },
    )
  }
}
