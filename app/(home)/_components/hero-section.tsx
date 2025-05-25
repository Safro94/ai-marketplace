import { HomeSectionDescription } from '@/components/page-container'
import { Badge } from '@/components/ui/badge'
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
            <Badge className='mb-6 py-1.5 px-6 bg-transparent text-primary dark:text-white border-purple-200 hover:bg-[initial'>
              Fresh Launch 🚀 Professional AI Resources
            </Badge>

            <h1 className='text-3xl md:text-8xl font-bold text-primary dark:text-primary-foreground px-2'>
              The marketplace for <br />
              ready-to-use AI resources
            </h1>

            <HomeSectionDescription className='text-slate-400 md:text-3xl md:max-w-4xl'>
              Skip the trial-and-error. Get proven AI prompts, custom GPTs, and
              automation tools that deliver results from day one.
            </HomeSectionDescription>

            <div className='flex flex-col md:flex-row md:justify-center gap-4 pt-4'>
              <Button size='lg' asChild>
                <Link href={ROUTES.explore()}>
                  Browse AI Tools
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
