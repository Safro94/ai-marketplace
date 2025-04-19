import { ThemeToggle } from '@/components/header/theme-toggle'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { ApplicationStatus } from '@prisma/client'
import Link from 'next/link'
import { FC } from 'react'
import { Logo } from '../logo'
import { CartButton } from './cart-button'
import { HeaderDropdown } from './header-dropdown'
import { HeaderMobileButton } from './header-mobile-button'
import { HeaderNav } from './header-nav'

interface Props {
  classNames?: {
    header?: string
    container?: string
  }
}

export const Header: FC<Props> = async ({ classNames }) => {
  const session = await getServerSession()
  let profile

  if (session?.user) {
    profile = await getUserProfile(session.user.id)
  }

  const isCreator = isAdminOrCreator(profile)
  const hasPendingApplication =
    profile?.creatorProfile?.creatorApplication?.status ===
    ApplicationStatus.PENDING

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        classNames?.header,
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center justify-between relative',
          !classNames?.container && 'container',
          classNames?.container,
        )}
      >
        <div className='flex items-center gap-6 md:gap-10'>
          <Logo />
          <HeaderNav
            isCreator={isCreator}
            hasPendingApplication={hasPendingApplication}
            className='hidden md:flex'
          />
        </div>

        <div className='flex items-center gap-4'>
          <ThemeToggle />

          {session?.user ? (
            <>
              {/* <NotificationsDropdown /> */}
              <CartButton />
              <HeaderDropdown isCreator={isCreator} user={session.user} />
            </>
          ) : (
            <div className='hidden md:flex gap-2'>
              <Button variant='outline' asChild>
                <Link href={ROUTES.login()}>Log in</Link>
              </Button>

              <Button asChild>
                <Link href={ROUTES.signUp()}>Sign up</Link>
              </Button>
            </div>
          )}

          <HeaderMobileButton
            isCreator={isCreator}
            hasPendingApplication={hasPendingApplication}
            user={session?.user}
          />
        </div>
      </div>
    </header>
  )
}
