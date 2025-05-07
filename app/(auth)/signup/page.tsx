import { AuthFormPanel } from '@/components/auth/auth-form-panel'
import { AuthSidePanel } from '@/components/auth/auth-side-panel'
import { PageContainer } from '@/components/page-container'
import { APP_DATA, ROUTES } from '@/lib/constants'
import loginImg from '@/public/login.svg'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from './_components/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | Create Your Account',
  description: `Create an account on ${APP_DATA.name} to buy AI assets, save favorites, and track your purchases.`,
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
    <PageContainer className='max-w-none min-h-screen grid lg:grid-cols-2 gap-12 md:p-0'>
      <AuthFormPanel
        title='Create your account'
        description='Sign up to start your journey'
        footer={
          <>
            <p className='mb-2'>
              By signing up, you agree to our <br />
              <Link
                href={ROUTES.terms()}
                className='font-bold text-primary dark:text-primary-foreground hover:underline'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href={ROUTES.privacy()}
                className='font-bold text-primary dark:text-primary-foreground hover:underline'
              >
                Privacy Policy
              </Link>
            </p>

            <p>
              Already have an account?{' '}
              <Link
                href={ROUTES.login()}
                className='font-bold text-primary dark:text-primary-foreground hover:underline'
              >
                Sign in
              </Link>
            </p>
          </>
        }
      >
        <SignupForm />
      </AuthFormPanel>

      <AuthSidePanel
        image={loginImg}
        phrase='Begin Your Adventure'
        description='The first step of many amazing opportunities.'
      />
    </PageContainer>
  )
}
