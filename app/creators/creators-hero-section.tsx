import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  isCreator: boolean
  hasPendingApplication: boolean
}

export const CreatorsHeroSection: FC<Props> = ({
  isCreator,
  hasPendingApplication,
}) => {
  return (
    <section className='relative py-20 md:py-28 overflow-hidden'>
      <div className='hero-gradient absolute inset-0 z-0 opacity-20'></div>
      <div className='container relative z-10'>
        <div className='flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            Share your AI expertise with the world
          </h1>

          <p className='text-xl text-muted-foreground max-w-2xl'>
            Join our marketplace as a creator and turn your AI assets into a
            sustainable revenue stream.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            {isCreator ? (
              <Button size='lg' asChild>
                <Link href='/creator-dashboard'>
                  Go to Creator Dashboard
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            ) : hasPendingApplication ? (
              <Card className='p-4 bg-secondary/30'>
                <CardContent className='p-0'>
                  <p className='text-center'>
                    Your creator application is pending review. We&apos;ll
                    notify you once it&apos;s approved.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Button size='lg' asChild>
                <Link href='/creators/apply'>
                  Apply as Creator
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            )}

            {!isCreator && !hasPendingApplication && (
              <Button size='lg' variant='outline' asChild>
                <Link href='#benefits'>Learn More</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
