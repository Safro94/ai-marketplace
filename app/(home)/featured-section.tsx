import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FeaturedAssets } from './featured-assets'

export const FeaturedSection = () => {
  return (
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Featured Assets
            </h2>

            <p className='text-muted-foreground mt-1'>
              Handpicked premium assets from our marketplace
            </p>
          </div>

          <Button variant='ghost' className='mt-4 md:mt-0' asChild>
            <Link href='/explore'>
              View all assets
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <FeaturedAssets />
      </div>
    </section>
  )
}
