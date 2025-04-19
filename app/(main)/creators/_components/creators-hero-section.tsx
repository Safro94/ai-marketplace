'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Motion } from '@/components/ui/motion'
import { ROUTES } from '@/lib/constants'
import { Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { animate, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect } from 'react'

interface Props {
  isCreator: boolean
  hasPendingApplication: boolean
}

const COLORS_TOP = ['#2d1155', '#ffffff', '#22d3ee', '#2d1155']

export const CreatorsHeroSection: FC<Props> = ({
  isCreator,
  hasPendingApplication,
}) => {
  const color = useMotionValue(COLORS_TOP[0])

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    })
  }, [color])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`
  const border = useMotionTemplate`1px solid ${color}`
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`

  return (
    <Motion
      type='section'
      className='relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200'
      style={{
        backgroundImage,
      }}
    >
      <div className='relative z-10 flex flex-col items-center'>
        <span className='mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm'>
          Beta Now Live!
        </span>

        <h1 className='max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight'>
          Share your AI expertise with the world
        </h1>

        <p className='my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed'>
          Join our marketplace as a creator and turn your AI assets into a
          sustainable revenue stream.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          {isCreator ? (
            <Button size='lg' asChild>
              <Motion
                type='button'
                style={{
                  border,
                  boxShadow,
                }}
                whileHover={{
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                className='group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50'
              >
                <Link href={ROUTES.creatorDashboard()}>
                  Go to Creator Dashboard
                  <ArrowRight className='transition-transform group-hover:-rotate-45 group-active:-rotate-12' />
                </Link>
              </Motion>
            </Button>
          ) : hasPendingApplication ? (
            <Card className='p-4 bg-secondary/30'>
              <CardContent className='p-0'>
                <p className='text-center'>
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
            <Button size='lg' variant='secondary' asChild>
              <a
                href='#benefits'
                onClick={(e) => {
                  e.nativeEvent.stopImmediatePropagation()
                }}
              >
                Learn More
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className='absolute inset-0 z-0'>
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </Motion>
  )
}
