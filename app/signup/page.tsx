import { PageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
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
    <PageContainer className='py-0 h-full flex items-center justify-center'>
      <Card className='mx-auto w-full lg:w-[30%]'>
        <CardHeader>
          <CardTitle>
            <h1 className='text-2xl font-semibold tracking-tight text-center'>
              Create an account
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SignupForm />
        </CardContent>

        <CardFooter className='flex flex-col gap-2 text-center text-sm text-muted-foreground'>
          <p>
            By signing up, you agree to our <br />
            <Link href={ROUTES.terms()} className='text-primary'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href={ROUTES.privacy()} className='text-primary'>
              Privacy Policy
            </Link>
          </p>

          <p>
            Already have an account?{' '}
            <Link
              href={ROUTES.login()}
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}
