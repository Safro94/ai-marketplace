'use client'

import { ThemeToggle } from '@/components/header/theme-toggle'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { cn, getCreatorsLinks } from '@/lib/utils'
import { Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'
import { Button } from '../ui/button'

interface Props {
  isCreator: boolean
  hasPendingApplication: boolean
}

export const HeaderMobileButton: FC<Props> = ({
  isCreator,
  hasPendingApplication,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
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
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search assets...'
                className='w-full pl-8'
              />
            </div>

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
