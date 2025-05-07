import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { getServerSession } from '@/lib/session'
import Link from 'next/link'

export const AffiliateCTASection = async () => {
  const session = await getServerSession()

  if (session?.user) return null

  return (
    <HomeSection className='bg-primary text-white'>
      <div className='text-center'>
        <HomeSectionTitleContainer>
          <HomeSectionTitle>Ready to Start Earning?</HomeSectionTitle>

          <HomeSectionDescription className='text-muted-foreground-primary-bg'>
            Sign up to our platform today and start earning rewards for every
            referral you bring.
          </HomeSectionDescription>
        </HomeSectionTitleContainer>

        <Button size='lg' variant='secondary' asChild className='w-fit'>
          <Link href={ROUTES.signUp()}>Sign Up Now</Link>
        </Button>
      </div>
    </HomeSection>
  )
}
