'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Logo } from './logo'
import { toast } from './ui/toast'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useAuth()
  const user = session?.user

  const navigation = [
    { name: 'Home', href: ROUTES.home() },
    { name: 'Explore', href: ROUTES.explore() },
    { name: 'Categories', href: ROUTES.categories() },
    { name: 'For Creators', href: ROUTES.creators() },
  ]

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6 md:gap-10'>
          <Logo />

          <nav className='hidden md:flex gap-6'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
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
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          {isSearchOpen ? (
            <div className='hidden md:flex items-center relative'>
              <Input
                type='search'
                placeholder='Search assets...'
                className='w-[200px] lg:w-[300px]'
              />
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-0'
                onClick={() => setIsSearchOpen(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <Button
              variant='ghost'
              size='icon'
              className='hidden md:flex'
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className='h-5 w-5' />
              <span className='sr-only'>Search</span>
            </Button>
          )}

          <ThemeToggle />

          {user ? (
            <>
              {/* <Notifications /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={user.image || ''}
                        alt={user.name || ''}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {user.name}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href='/account'>Account</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href='/purchases'>Purchases</Link>
                  </DropdownMenuItem>

                  {/* {user.isCreator && (
                    <DropdownMenuItem asChild>
                      <Link href='/creator-dashboard'>Creator Dashboard</Link>
                    </DropdownMenuItem>
                  )} */}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={async () => {
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess() {
                            router.push(ROUTES.home())
                          },
                          onError(context) {
                            toast.error('Error', {
                              description: context.error.message,
                            })
                          },
                        },
                      })
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className='hidden md:flex gap-2'>
              <Button variant='ghost' asChild>
                <Link href='/login'>Log in</Link>
              </Button>
              <Button asChild>
                <Link href='/signup'>Sign up</Link>
              </Button>
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-border/40'>
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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {!user && (
                <>
                  <Link
                    href={ROUTES.login()}
                    className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                    onClick={() => setIsMenuOpen(false)}
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
    </header>
  )
}
