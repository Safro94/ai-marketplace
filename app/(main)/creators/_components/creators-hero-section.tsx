import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Motion } from '@/components/ui/motion'
import { LOWEST_SERVICE_CHARGE, ROUTES } from '@/lib/constants'
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
  const description =
    'Unlock exclusive benefits as a creator. Get a special creator code, earn higher commissions, and access advanced tools to maximize your earnings.'.split(
      ' ',
    )

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
          <Motion<'h1'>
            type='h1'
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
            }}
            className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'
          >
            Creators{' '}
            <span className='text-[hsl(264.7,66.7%,80%)]'>Earn More</span>
          </Motion>

          <p className='text-xl md:text-2xl mb-8 opacity-90'>
            {description.map((el, i) => (
              <Motion<'span'>
                key={i}
                type='span'
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i / 10,
                }}
              >
                {el}{' '}
              </Motion>
            ))}
          </p>

          <Motion
            className='flex flex-col sm:flex-row gap-4'
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
            }}
          >
            {isCreator ? (
              <Button variant='secondary' size='lg' asChild>
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
                    Your creator application is pending review. We&apos;ll
                    notify you once it&apos;s approved.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Button variant='secondary' size='lg' asChild>
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

          <div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
            {[
              {
                title: '2X',
                description: 'Earning Potential',
              },
              {
                title: `${LOWEST_SERVICE_CHARGE * 100}%`,
                description: 'Minimum Commission',
              },
              {
                title: '4',
                description: 'Commission Tiers',
              },
              {
                title: '24/7',
                description: 'Creator Support',
              },
            ].map(({ title, description }) => (
              <Motion
                key={title}
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                }}
              >
                <div className='text-3xl font-bold'>{title}</div>
                <div className='text-sm opacity-80'>{description}</div>
              </Motion>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
