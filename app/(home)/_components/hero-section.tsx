import { HomeSectionDescription } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect'
import { LampContainer } from '@/components/ui/lamp-container'
import { Motion } from '@/components/ui/motion'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = async () => {
  let profile
  const session = await getServerSession()

  if (session?.user) {
    profile = await getUserProfile(session?.user.id)
  }

  return (
    <section className='relative overflow-hidden flex'>
      <GoogleGeminiEffect>
        <LampContainer>
          <Motion<'div'>
            className='mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium text-transparent md:text-7xl space-y-4'
            initial={{ opacity: 0.3, y: 350 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: 'easeInOut',
            }}
          >
            <div className='inline-flex items-center bg-primary rounded-lg border border-white px-4 py-1.5 text-sm font-medium mb-4'>
              <span className='text-xs md:text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 font-medium'>
                Just Launched
              </span>

              <span className='mx-2 h-0.5 w-0.5 rounded-full bg-border' />
              <span className='text-xs md:text-sm text-white'>
                Discover our AI asset marketplace
              </span>
            </div>

            <h1 className='text-3xl md:text-8xl font-bold text-primary dark:text-primary-foreground px-2'>
              The marketplace for <br />
              premium AI-Powered Tools
            </h1>

            <HomeSectionDescription className='text-slate-400 md:text-3xl max-w-none'>
              Discover high-quality AI prompt systems, custom GPTs, and
              specialized tools created by experts.
            </HomeSectionDescription>

            <div className='flex flex-col md:flex-row md:justify-center gap-4 pt-4'>
              <Button size='lg' asChild>
                <Link href={ROUTES.explore()}>
                  Explore Marketplace
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>

              <Button
                size='lg'
                variant='outline'
                asChild
                className='text-accent-foreground'
              >
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
          </Motion>
        </LampContainer>
      </GoogleGeminiEffect>
    </section>
  )
}
