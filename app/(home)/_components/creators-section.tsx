import { BENEFITS } from '@/app/(main)/creators/_components/creators-benefits-section'
import { HomeSection } from '@/components/page-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Motion } from '@/components/ui/motion'
import { ROUTES, STAGGER } from '@/lib/constants'
import creatorsImg from '@/public/creators.svg'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const CreatorsSection = () => {
  return (
    <HomeSection className='bg-muted'>
      <div className='max-w-7xl grid md:grid-cols-[max-content,1fr] gap-12 items-center mx-auto'>
        <Image
          src={creatorsImg}
          alt='Creator program illustration'
          width={500}
          height={400}
        />

        <div className='order-1 md:order-2'>
          <Badge className='w-fit px-3 py-1text-sm font-medium mb-4'>
            FOR CREATORS
          </Badge>

          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Creator Program
          </h2>

          <p className='text-lg text-muted-foreground mb-6'>
            Take your earnings to the next level as a creator. Get an exclusive
            creator code and enjoy decreasing commission rates as your referrals
            generate more sales.
          </p>

          <Motion
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={STAGGER}
            className='space-y-4 mb-8'
          >
            {BENEFITS.map(({ title, description }, i) => (
              <Motion
                key={i}
                className='flex items-start gap-3'
                variants={{
                  hidden: { opacity: 0, x: 150 },
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

          <Button asChild>
            <Link href={ROUTES.creators()}>
              Learn More <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </HomeSection>
  )
}
