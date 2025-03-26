'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const CreatorCTASection = () => {
  return (
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Become a Creator and Share Your AI Assets
          </h2>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Join our marketplace and start selling your AI assets to
            professionals worldwide. Turn your expertise into a revenue stream.
          </p>
          <div className='pt-4'>
            <Button size='lg' asChild>
              <Link href='/creators'>
                Start Selling Today
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
          <p className='text-sm text-muted-foreground'>
            No technical setup required. We handle payments, delivery, and
            platform maintenance.
          </p>
        </div>
      </div>
    </section>
  )
}
