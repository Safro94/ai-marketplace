import { HomeSection } from '@/components/page-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Motion } from '@/components/ui/motion'
import { ROUTES, STAGGER } from '@/lib/constants'
import affiliateImg from '@/public/affiliate.svg'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const AffiliateSection = () => {
  return (
    <HomeSection>
      <div className='max-w-7xl grid md:grid-cols-[1fr,max-content] gap-12 items-center mx-auto'>
        <div>
          <Badge className='w-fit px-3 py-1text-sm font-medium mb-4'>
            FOR EVERYONE
          </Badge>

          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Affiliate Program
          </h2>

          <p className='text-lg text-muted-foreground mb-6'>
            Everyone gets a referral code when they sign up. Share your code and
            earn increasing rewards as more people use it.
          </p>

          <Motion
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={STAGGER}
            className='space-y-4 mb-8'
          >
            {[
              {
                title: 'Automatic Code Assignment',
                description:
                  'Receive your unique referral code immediately upon signing up.',
              },
              {
                title: 'Tiered Discount Rewards',
                description:
                  'Earn 5%, 7.5%, 10%, and 15% discount codes as your referrals grow and use your code.',
              },
              {
                title: 'Easy Tracking',
                description:
                  'Monitor your referral performance through your user dashboard.',
              },
            ].map(({ title, description }, i) => (
              <Motion
                key={i}
                className='flex items-start gap-3'
                variants={{
                  hidden: { opacity: 0, x: -150 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.3, delay: i * 0.3 },
                  },
                }}
              >
                <CheckCircle className='h-6 w-6 text-primary dark:text-primary-foreground flex-shrink-0' />

                <div>
                  <div className='font-medium leading-none mb-1'>{title}</div>
                  <p className='text-sm text-muted-foreground'>{description}</p>
                </div>
              </Motion>
            ))}
          </Motion>

          <Button className='w-fit' asChild>
            <Link href={ROUTES.affiliate()}>
              Learn More <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <Image
          src={affiliateImg}
          alt='Affiliate program illustration'
          width={500}
          height={400}
        />
      </div>
    </HomeSection>
  )
}
