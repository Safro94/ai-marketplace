import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/data-access/profile'
import { LOWEST_SERVICE_CHARGE, ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const AffiliateHero = async () => {
  const session = await getServerSession()

  let profile

  if (session?.user) {
    profile = await getUserProfile(session.user.id)
  }

  return (
    <section className='relative bg-primary text-white overflow-hidden'>
      {/* Background pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-full h-full'>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-white'
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32'>
        <div className='max-w-3xl'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
            Share. Refer.{' '}
            <span className='text-[hsl(264.7,66.7%,80%)]'>Earn.</span>
          </h1>

          <p className='text-xl md:text-2xl mb-8 opacity-90'>
            Every user gets a unique referral code upon signup. Share your code
            and earn rewards for every person you refer. The more successful
            your referrals, the bigger your rewards.
          </p>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Button size='lg' variant='secondary' asChild>
              {!session?.user ? (
                <Link href={ROUTES.signUp()}>Sign Up</Link>
              ) : isAdminOrCreator(profile) ? (
                <Link href={ROUTES.creatorDashboard()}>
                  Go to Creator Dashboard
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              ) : (
                <Link href={ROUTES.dashboard()}>Go to dashboard</Link>
              )}
            </Button>

            <Button size='lg' variant='outline' asChild>
              <a href='#how-it-works'>
                How It Works <ArrowRight className='ml-2 h-4 w-4' />
              </a>
            </Button>
          </div>

          <div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
            <div>
              <h3 className='text-3xl font-bold'>2</h3>
              <p className='text-sm opacity-80'>Affiliate Types</p>
            </div>

            <div>
              <h3 className='text-3xl font-bold'>4</h3>
              <p className='text-sm opacity-80'>Reward Tiers</p>
            </div>

            <div>
              <h3 className='text-3xl font-bold'>15%</h3>
              <p className='text-sm opacity-80'>Max Discount</p>
            </div>

            <div>
              <h3 className='text-3xl font-bold'>
                {LOWEST_SERVICE_CHARGE * 100}%
              </h3>
              <p className='text-sm opacity-80'>Min Commission</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
