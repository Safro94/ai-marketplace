import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className='border-t border-border/40 bg-background'>
      <div className='container py-8 md:py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600'>
                AIAssets
              </span>
            </Link>

            <p className='text-sm text-muted-foreground'>
              The marketplace for high-quality AI assets, tools, and resources.
            </p>

            <div className='flex space-x-4'>
              <Button variant='ghost' size='icon' asChild>
                <Link
                  href='https://twitter.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-5 w-5'
                  >
                    <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                  </svg>
                  <span className='sr-only'>Twitter</span>
                </Link>
              </Button>

              <Button variant='ghost' size='icon' asChild>
                <Link
                  href='https://github.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-5 w-5'
                  >
                    <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
                    <path d='M9 18c-4.51 2-5-2-7-2' />
                  </svg>
                  <span className='sr-only'>GitHub</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-medium'>Marketplace</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/explore'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href='/featured'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  href='/new'
                  className='text-muted-foreground hover:text-foreground'
                >
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-medium'>For Creators</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/creators'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Sell on AIAssets
                </Link>
              </li>
              <li>
                <Link
                  href='/creator-terms'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Terms for Creators
                </Link>
              </li>
              <li>
                <Link
                  href='/creator-resources'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href='/creator-faq'
                  className='text-muted-foreground hover:text-foreground'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-medium'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='text-muted-foreground hover:text-foreground'
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} AIAssets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
