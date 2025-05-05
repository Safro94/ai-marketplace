import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { LOWEST_SERVICE_CHARGE, SERVICE_CHARGE, STAGGER } from '@/lib/constants'
import creatorsImg from '@/public/creators.svg'
import { Award, BarChart3, Clock, Gift } from 'lucide-react'
import Image from 'next/image'

export const BENEFITS = [
  {
    Icon: Award,
    title: 'Creator Dashboard',
    description:
      'Access an advanced dashboard to track your product performance, sales, understand your audience, and optimize your referral strategy.',
  },
  {
    Icon: Gift,
    title: 'Exclusive Creator Code',
    description:
      'Receive a special creator code in addition to your regular user code, allowing you to earn from two different referral streams.',
  },
  {
    Icon: BarChart3,
    title: 'Decreasing Commission Rates',
    description: `As your referrals generate more sales, your commission rate decreases from ${SERVICE_CHARGE * 100}% to as low as ${LOWEST_SERVICE_CHARGE * 100}%, meaning you keep more of your earnings.`,
  },
  {
    Icon: Clock,
    title: 'Instant Payouts',
    description:
      'Get paid quickly instantly with our streamlined payment process and multiple options',
  },
]

export const CreatorsBenefitsSection = () => {
  return (
    <HomeSection id='benefits' className='bg-muted'>
      <HomeSectionTitleContainer>
        <HomeSectionTitle>Why Become a Creator?</HomeSectionTitle>

        <HomeSectionDescription>
          As a creator, you&apos;ll unlock exclusive benefits and earn more from
          your influence.
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <div className='grid md:grid-cols-2 gap-12 items-center'>
        <div className='order-2 md:order-1'>
          <Motion
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={STAGGER}
            className='space-y-8'
          >
            {BENEFITS.map(({ Icon, title, description }, i) => (
              <Motion
                key={i}
                className='flex gap-4'
                variants={{
                  hidden: { opacity: 0.1, x: -50 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.3, delay: i * 0.3 },
                  },
                }}
              >
                <div className='bg-primary p-3 rounded-full h-12 w-12 flex items-center justify-center text-white shrink-0'>
                  <Icon className='h-6 w-6' />
                </div>

                <div>
                  <h3 className='text-xl font-bold mb-1'>{title}</h3>
                  <p className='text-muted-foreground'>{description}</p>
                </div>
              </Motion>
            ))}
          </Motion>
        </div>

        <div className='order-1 md:order-2'>
          <Image
            src={creatorsImg}
            alt='Creator benefits illustration'
            width={600}
            height={500}
          />
        </div>
      </div>
    </HomeSection>
  )
}
