import {
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import Spline from '@splinetool/react-spline/next'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const HeroSection = async () => {
  let profile
  const session = await getServerSession()

  if (session?.user) {
    profile = await getUserProfile(session?.user.id)
  }

  return (
    <section className='relative min-h-[75vh] overflow-hidden flex'>
      <Suspense fallback={<div className='absolute inset-0 bg-black' />}>
        <Spline
          className='absolute inset-0 scale-125'
          scene='https://prod.spline.design/eCjzFag6WDawhhgS/scene.splinecode'
        />
      </Suspense>

      <div className='flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto z-20'>
        <div className='inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4'>
          <span className='text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 font-medium'>
            Just Launched
          </span>

          <span className='mx-2 h-0.5 w-0.5 rounded-full bg-border'></span>
          <span className='text-sm text-white'>
            Discover our AI asset marketplace
          </span>
        </div>

        <HomeSectionTitle className='text-white text-6xl'>
          The marketplace for premium AI assets
        </HomeSectionTitle>

        <HomeSectionDescription className='text-lg text-muted-foreground-primary-bg'>
          Discover high-quality AI prompt systems, custom GPTs, and specialized
          tools created by experts.
        </HomeSectionDescription>

        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          <Button size='lg' asChild>
            <Link href={ROUTES.explore()}>
              Explore Marketplace
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>

          <Button size='lg' variant='outline' asChild>
            {isAdminOrCreator(profile) ? (
              <Link href={ROUTES.creatorDashboard()}>
                Go to Creator Dashboard
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            ) : (
              <Link href={ROUTES.creators()}>Become a Creator</Link>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
