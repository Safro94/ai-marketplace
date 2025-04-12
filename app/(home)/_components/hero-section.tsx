import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/db/permissions'
import { getUserProfile } from '@/lib/db/users'
import { getServerSession } from '@/lib/session'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = async () => {
  const session = await getServerSession()
  let profile

  if (session?.user) {
    profile = await getUserProfile(session?.user.id)
  }

  return (
    <section className='relative py-20 md:py-28 overflow-hidden'>
      <div className='hero-gradient absolute inset-0 z-0 opacity-20' />

      <div className='container relative z-10'>
        <div className='flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto'>
          <div className='inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4'>
            <span className='text-xs bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 font-medium'>
              Just Launched
            </span>

            <span className='mx-2 h-0.5 w-0.5 rounded-full bg-border'></span>
            <span className='text-xs'>Discover our AI asset marketplace</span>
          </div>

          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            The marketplace for premium{' '}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600'>
              AI assets
            </span>
          </h1>

          <p className='text-xl text-muted-foreground max-w-2xl'>
            Discover high-quality AI prompt systems, custom GPTs, and
            specialized tools created by experts.
          </p>

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
      </div>
    </section>
  )
}
