import { Benefit } from '@/components/benefit'
import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { SERVICE_CHARGE, STAGGER, TRANSITION_DELAY } from '@/lib/constants'
import { Clock, DollarSign, Package, Shield } from 'lucide-react'

const BENEFITS = [
  {
    Icon: DollarSign,
    title: 'Competitive Commission',
    description: `Keep ${100 - SERVICE_CHARGE * 100}% of your sales with our industry-leading commission structure.`,
  },
  {
    Icon: Package,
    title: 'Manage Products',
    description:
      'Easy-to-use dashboard to handle your product listings, sales, and analytics(analytics is a premium feature, coming soon)',
  },
  {
    Icon: Clock,
    title: 'Instant Payouts',
    description:
      'Get paid quickly instantly with our streamlined payment process and multiple options',
  },
  {
    Icon: Shield,
    title: 'Secure Platform',
    description:
      'We handle payments, delivery, and customer support so you can focus on creation.',
  },
]

export const CreatorsBenefitsSection = () => {
  return (
    <HomeSection id='benefits' className='bg-muted grid md:grid-cols-2'>
      <HomeSectionTitleContainer className='justify-center text-left'>
        <HomeSectionTitle>Why Sell on our platform?</HomeSectionTitle>

        <HomeSectionDescription className='text-left'>
          Join thousands of creators who are earning a living by selling their
          digital products on our marketplace. No technical skills required to
          get started.
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <Motion
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        variants={STAGGER}
        className='grid md:grid-cols-2 gap-4'
      >
        {BENEFITS.map(({ Icon, title, description }, i) => (
          <Benefit
            key={title}
            icon={Icon}
            title={title}
            description={description}
            delay={TRANSITION_DELAY * i}
          />
        ))}
      </Motion>
    </HomeSection>
  )
}
