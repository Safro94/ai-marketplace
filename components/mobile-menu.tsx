'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { HEADER_LINKS, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface Props {
  onLinkClick: () => void
}

export const MobileMenu: FC<Props> = ({ onLinkClick }) => {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
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
          {HEADER_LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
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
                onClick={onLinkClick}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              >
                Log in
              </Link>

              <Button asChild className='w-full'>
                <Link href={ROUTES.signUp()} onClick={onLinkClick}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
