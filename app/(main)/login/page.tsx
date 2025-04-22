import { PageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_DATA, ROUTES } from '@/lib/constants'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './_components/login-form'

export const metadata: Metadata = {
  title: 'Log In | Access Your Account',
  description: `Log in to your ${APP_DATA.name} account to access your purchased assets, manage your profile, and more.`,
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
    <PageContainer className='py-0 h-full flex items-center justify-center'>
      <Card className='mx-auto w-full lg:w-[30%]'>
        <CardHeader>
          <CardTitle>
            <h1 className='text-2xl font-semibold tracking-tight text-center'>
              Sign in to AIAssetHub
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className='justify-center text-center text-sm text-muted-foreground'>
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.signUp()}
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}
