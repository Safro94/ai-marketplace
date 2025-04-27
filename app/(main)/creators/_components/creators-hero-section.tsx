import { HomeSectionDescription } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FloatingPaths } from '@/components/ui/floating-path'
import { Motion } from '@/components/ui/motion'
import { ROUTES } from '@/lib/constants'
import { ArrowRight, InfoIcon } from 'lucide-react'
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
  const title = 'Share your AI expertise with the world'.split(' ')
  const description =
    'Join our marketplace as a creator and turn your AI assets into a sustainable revenue stream.'.split(
      ' ',
    )

  return (
    <section className='relative min-h-[65vh] overflow-hidden flex'>
      <div className='absolute inset-0'>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className='flex flex-col items-center justify-center text-center space-y-6 max-w-7xl mx-auto z-20'>
        <h1 className='text-4xl md:text-8xl font-bold text-primary dark:text-primary-foreground px-2'>
          {title.map((el, i) => (
            <Motion<'span'>
              key={i}
              type='span'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: i / 10,
              }}
            >
              {el}{' '}
            </Motion>
          ))}
        </h1>

        <HomeSectionDescription className='text-slate-400 md:text-4xl md:max-w-4xl'>
          {description.map((el, i) => (
            <Motion<'span'>
              key={i}
              type='span'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
            >
              {el}{' '}
            </Motion>
          ))}
        </HomeSectionDescription>

        <Motion<'div'>
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className='flex flex-col sm:flex-row gap-4 pt-4'
        >
          {isCreator ? (
            <Button size='lg' asChild>
              <Link href={ROUTES.creatorDashboard()}>
                Go to Creator Dashboard
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          ) : hasPendingApplication ? (
            <Card className='p-4 mx-4'>
              <CardContent className='p-0'>
                <p className='font-bold text-center flex gap-2 items-center'>
                  <InfoIcon className='w-6 h-6 flex-shrink-0' />
                  Your creator application is pending review. We&apos;ll notify
                  you once it&apos;s approved.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Button size='lg' asChild>
              <Link href={ROUTES.creatorsApply()}>
                Apply as Creator
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          )}

          {!hasPendingApplication && (
            <Button size='lg' variant='outline' asChild>
              <Link href='#benefits'>Learn More</Link>
            </Button>
          )}
        </Motion>
      </div>
    </section>
  )
}
