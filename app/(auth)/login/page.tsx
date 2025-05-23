import { AuthFormPanel } from '@/components/auth/auth-form-panel'
import { AuthSidePanel } from '@/components/auth/auth-side-panel'
import { PageContainer } from '@/components/page-container'
import { APP_DATA, ROUTES } from '@/lib/constants'
import loginImg from '@/public/login.svg'
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const callbackUrl = (await searchParams).callbackUrl

  return (
    <PageContainer className='max-w-none min-h-screen grid lg:grid-cols-2 gap-12 md:p-0'>
      <AuthFormPanel
        title='Sign in to your account'
        description='Enter your credentials to access your account'
        footer={
          <>
            <p>
              Don&apos;t have an account?{' '}
              <Link
                href={ROUTES.signUp()}
                className='font-bold text-primary dark:text-primary-foreground hover:underline'
              >
                Sign up
              </Link>
            </p>
          </>
        }
      >
        <LoginForm callbackUrl={callbackUrl} />
      </AuthFormPanel>

      <AuthSidePanel
        image={loginImg}
        phrase='Unlock Your Potential'
        description='Every sign in is a step toward success.'
      />
    </PageContainer>
  )
}
