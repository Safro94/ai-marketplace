import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const CreatorCTASection = async () => {
  const session = await getServerSession()
  let profile

  if (session?.user) {
    profile = await getUserProfile(session?.user.id)
  }

  if (isAdminOrCreator(profile)) return null

  return (
    <HomeSection className='bg-primary'>
      <div className='max-w-4xl mx-auto text-center space-y-6'>
        <HomeSectionTitle className='text-white'>
          Become a Creator and Share Your AI Assets
        </HomeSectionTitle>

        <HomeSectionDescription className='text-muted-foreground-primary-bg'>
          Join our marketplace and start selling your AI assets to professionals
          worldwide. Turn your expertise into a revenue stream.
        </HomeSectionDescription>

        <div className='pt-4'>
          <Button size='lg' asChild variant='outline'>
            <Link href={ROUTES.creators()}>
              Start Selling Today
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <p className='text-sm text-muted-foreground-primary-bg'>
          No technical setup required. We handle payments, delivery, and
          platform maintenance.
        </p>
      </div>
    </HomeSection>
  )
}
