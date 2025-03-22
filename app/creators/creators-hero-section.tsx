import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const CreatorsHeroSection = () => {
  return (
    <section className='relative py-20 md:py-28 overflow-hidden'>
      <div className='hero-gradient absolute inset-0 z-0 opacity-20' />

      <div className='container relative z-10'>
        <div className='flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            Share your AI expertise with the world
          </h1>

          <p className='text-xl text-muted-foreground max-w-2xl'>
            Join our marketplace as a creator and turn your AI assets into a
            sustainable revenue stream.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Button size='lg' asChild>
              <Link href='/creators/apply'>
                Apply as Creator
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>

            <Button size='lg' variant='outline' asChild>
              <Link href='#benefits'>Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
