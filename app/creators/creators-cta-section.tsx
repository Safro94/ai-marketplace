import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const CreatorsCTASection = () => {
  return (
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Ready to Share Your AI Assets?
          </h2>

          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Join our growing community of creators and start earning from your
            AI expertise.
          </p>

          <div className='pt-4'>
            <Button size='lg' asChild>
              <Link href='/creators/apply'>
                Apply as Creator
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
