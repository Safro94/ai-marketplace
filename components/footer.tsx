import {
  LINKEDIN_URL,
  PAGE_PADDING,
  ROUTES,
  TWITTER_URL,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Linkedin, TwitterIcon } from 'lucide-react'
import Link from 'next/link'
import { Logo } from './logo'

export const Footer = () => {
  return (
    <footer className='border-t border-border/40 bg-background'>
      <div className={cn('py-8 md:py-12', PAGE_PADDING)}>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='space-y-4'>
            <Logo />

            <p className='text-sm text-muted-foreground'>
              Premium AI tools and prompts that actually deliver results.
            </p>

            <div className='flex gap-4'>
              <a href={TWITTER_URL} target='_blank' rel='noreferrer'>
                <TwitterIcon className='w-5 h-5' />
                <span className='sr-only'>Twitter</span>
              </a>

              <a href={LINKEDIN_URL} target='_blank' rel='noreferrer'>
                <Linkedin className='w-5 h-5 dark:fill-white' />
                <span className='sr-only'>Linkedin</span>
              </a>
            </div>
          </div>

          <Section
            title='Marketplace'
            items={[{ text: 'Explore', link: ROUTES.explore() }]}
          />

          <Section
            title='For Creators'
            items={[
              { text: `Sell on AIAssetHub`, link: ROUTES.creators() },
              { text: 'Terms for Creators', link: ROUTES.creatorTerms() },
              { text: 'FAQ', link: ROUTES.creatorFAQ() },
            ]}
          />

          <Section
            title='Company'
            items={[
              { text: 'About', link: ROUTES.about() },
              { text: 'Contact', link: ROUTES.contact() },
              { text: 'Privacy Policy', link: ROUTES.privacy() },
              { text: 'Terms of Service', link: ROUTES.terms() },
            ]}
          />
        </div>

        <div className='mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} AIAssetHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const Section = ({
  title,
  items,
}: {
  title: string
  items: { text: string; link: string }[]
}) => (
  <div className='space-y-4'>
    <h3 className='text-sm font-medium'>{title}</h3>
    <ul className='space-y-2 text-sm'>
      {items.map(({ text, link }) => (
        <li key={text}>
          <Link
            href={link}
            className='text-muted-foreground hover:text-foreground'
          >
            {text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)
