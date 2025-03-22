import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | Create Your Account',
  description:
    'Create an account on AIAssets Marketplace to buy AI assets, save favorites, and track your purchases.',
  alternates: {
    canonical: '/signup',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignupPage() {
  return (
    <div className='container flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-secondary/80' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600'>
              AIAssets
            </span>
          </Link>
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &quot;Joining this marketplace was one of the best decisions for
              my business. I&apos;ve found incredible AI assets that have
              transformed my workflow.&quot;
            </p>
            <footer className='text-sm'>Marcus Johnson</footer>
          </blockquote>
        </div>
      </div>

      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Create an account
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your details below to create your account
            </p>
          </div>

          <SignupForm />

          <p className='px-8 text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
