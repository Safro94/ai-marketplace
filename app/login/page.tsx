import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Log In | Access Your Account',
  description:
    'Log in to your AIAssets account to access your purchased assets, manage your profile, and more.',
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginPage() {
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
              &quot;This marketplace has completely transformed how I create
              content. The AI assets are top-notch and save me hours of work
              every week.&quot;
            </p>
            <footer className='text-sm'>Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email to sign in to your account
            </p>
          </div>

          <LoginForm />

          <p className='px-8 text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
