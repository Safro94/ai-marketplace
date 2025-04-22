'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Motion } from '@/components/ui/motion'
import { STAGGER } from '@/lib/constants'
import { Testimonial } from '@prisma/client'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  testimonials: Partial<Testimonial>[]
}

export const TestimonialsCarousel: FC<Props> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
    )
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    )
  }

  return (
    <Motion
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
      variants={STAGGER}
      className='max-w-4xl mx-auto'
    >
      <Card className='border border-primary bg-muted'>
        <CardContent className='p-8 md:p-12'>
          <Quote className='h-12 w-12 text-primary/20 mb-6' />

          <p className='text-xl md:text-2xl font-medium mb-8'>
            {testimonials[currentIndex].content}
          </p>

          <div className='flex items-center'>
            <Avatar className='h-12 w-12 mr-4'>
              <AvatarImage
                src={testimonials[currentIndex].authorAvatar ?? '/placeholder'}
                alt={testimonials[currentIndex].authorName}
              />

              <AvatarFallback>
                {testimonials[currentIndex].authorName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className='font-semibold'>
                {testimonials[currentIndex].authorName}
              </h3>

              <p className='text-sm text-muted-foreground'>
                {testimonials[currentIndex].authorRole}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-center items-center mt-6 space-x-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={prevTestimonial}
          className='h-8 w-8 rounded-full'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Previous testimonial</span>
        </Button>

        {testimonials.map((_, i) => (
          <Button
            key={i}
            variant='ghost'
            size='icon'
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full p-0 ${i === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className='sr-only'>Testimonial {i + 1}</span>
          </Button>
        ))}

        <Button
          variant='outline'
          size='icon'
          onClick={nextTestimonial}
          className='h-8 w-8 rounded-full'
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Next testimonial</span>
        </Button>
      </div>
    </Motion>
  )
}
