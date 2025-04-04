'use client'

import { ThemeToggle } from '@/components/header/theme-toggle'
import { ROUTES } from '@/lib/constants'
import { cn, getCreatorsLinks } from '@/lib/utils'
import { User } from 'better-auth'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'
import { Button } from '../ui/button'

interface Props {
  isCreator: boolean
  user: User | undefined
  hasPendingApplication: boolean
}

export const HeaderMobileButton: FC<Props> = ({
  user,
  isCreator,
  hasPendingApplication,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const links = getCreatorsLinks(isCreator, hasPendingApplication)

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
        <div className='md:hidden absolute top-16 left-0 right-0 z-10 bg-background border-t border-border/40'>
          <div className='container py-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Theme</span>
              <ThemeToggle />
            </div>

            <nav className='flex flex-col space-y-4'>
              {links.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.name}
                </Link>
              ))}

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
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
