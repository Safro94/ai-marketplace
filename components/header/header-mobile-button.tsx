'use client'

import { ROUTES } from '@/lib/constants'
import { User } from 'better-auth'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { FC, useState } from 'react'
import { Button } from '../ui/button'
import { HeaderNav } from './header-nav'

interface Props {
  user: User | undefined
  isCreator: boolean
  hasPendingApplication: boolean
}

export const HeaderMobileButton: FC<Props> = ({
  user,
  isCreator,
  hasPendingApplication,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        <span className='sr-only'>Toggle menu</span>
      </Button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden absolute top-16 left-0 right-0 z-10 bg-background border-y border-border'>
          <div className='px-8 py-4'>
            <HeaderNav
              isCreator={isCreator}
              hasPendingApplication={hasPendingApplication}
              onClick={() => setIsMenuOpen(false)}
              className='flex-col'
            >
              {!user && (
                <>
                  <Link
                    href={ROUTES.login()}
                    onClick={() => setIsMenuOpen(false)}
                    className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                  >
                    Log in
                  </Link>

                  <Button asChild className='w-full'>
                    <Link
                      href={ROUTES.signUp()}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </HeaderNav>
          </div>
        </div>
      )}
    </>
  )
}
