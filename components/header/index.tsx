import { ThemeToggle } from '@/components/header/theme-toggle'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import Link from 'next/link'
import { Logo } from '../logo'
import { CartButton } from './cart-button'
import { HeaderDropdown } from './header-dropdown'
import { HeaderMobileButton } from './header-mobile-button'
import { HeaderNav } from './header-nav'
import { HeaderSearchbar } from './header-searchbar'

export const Header = async () => {
  const { user } = await validateSession()
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      creatorProfile: {
        include: {
          creatorApplication: true,
        },
      },
    },
  })

  const isCreator = !!profile?.isCreator
  const hasPendingApplication =
    profile?.creatorProfile?.creatorApplication?.status ===
    ApplicationStatus.PENDING

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between relative'>
        <div className='flex items-center gap-6 md:gap-10'>
          <Logo />
          <HeaderNav
            isCreator={isCreator}
            hasPendingApplication={hasPendingApplication}
          />
        </div>

        <div className='flex items-center gap-4'>
          <HeaderSearchbar />
          <ThemeToggle />

          {user ? (
            <>
              <CartButton />
              {/* <Notifications /> */}
              <HeaderDropdown isCreator={isCreator} />
            </>
          ) : (
            <div className='hidden md:flex gap-2'>
              <Button variant='ghost' asChild>
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
          />
        </div>
      </div>
    </header>
  )
}
