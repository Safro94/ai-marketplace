import {
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const CreatorsCTASection = () => {
  return (
    <section className='py-16 bg-secondary/30'>
      <div className='max-w-4xl mx-auto text-center space-y-6'>
        <HomeSectionTitle>Ready to Share Your AI Assets?</HomeSectionTitle>

        <HomeSectionDescription>
          Join our growing community of creators and start earning from your AI
          expertise.
        </HomeSectionDescription>

        <div className='pt-4'>
          <Button size='lg' asChild>
            <Link href={ROUTES.creatorsApply()}>
              Apply as Creator
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
