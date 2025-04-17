'use client'

import { ROUTES } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { Button } from './ui/button'

interface Props {
  reset: () => void
}

export const Error: FC<Props> = ({ reset }) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='container max-w-md px-4 py-8 text-center'>
        <Image
          src='/error-page.svg'
          alt='404 not found image'
          width={400}
          height={300}
          className='mb-6'
        />

        <h1 className='mb-4 text-4xl font-bold text-foreground-900'>
          Oops! Something went wrong
        </h1>

        <p className='mb-8 text-lg text-foreground-600'>
          We&apos;re sorry, it seems there was an error. Please try again or
          contact support if the problem persists.
        </p>

        <div className='flex gap-4 justify-center'>
          <Button onClick={() => reset()} variant='outline'>
            Try again
          </Button>

          <Button asChild>
            <Link href={ROUTES.home()}>Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
