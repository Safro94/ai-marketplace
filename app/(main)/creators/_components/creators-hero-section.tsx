import {
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { ArrowRight, InfoIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  isCreator: boolean
  hasPendingApplication: boolean
}

const Spline = dynamic(() => import('@splinetool/react-spline'))

export const CreatorsHeroSection: FC<Props> = ({
  isCreator,
  hasPendingApplication,
}) => {
  return (
    <section className='relative min-h-[75vh] bg-black overflow-hidden flex'>
      <Spline
        className='absolute scale-125'
        scene='https://prod.spline.design/k5BofMnTaYCm2Pnu/scene.splinecode'
      />

      <div className='flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto z-20'>
        <HomeSectionTitle className='text-white md:text-6xl'>
          Share your AI expertise with the world
        </HomeSectionTitle>

        <HomeSectionDescription className='text-muted-foreground-primary-bg'>
          Join our marketplace as a creator and turn your AI assets into a
          sustainable revenue stream.
        </HomeSectionDescription>

        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
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
        </div>
      </div>
    </section>
  )
}
