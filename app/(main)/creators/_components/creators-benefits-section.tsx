import { Benefit } from '@/components/benefit'
import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import {
  APP_DATA,
  SERVICE_CHARGE,
  STAGGER,
  TRANSITION_DELAY,
} from '@/lib/constants'
import { BarChart, DollarSign, Shield } from 'lucide-react'

const BENEFITS = [
  {
    Icon: DollarSign,
    title: 'Competitive Commission',
    description: `Keep ${100 - SERVICE_CHARGE * 100}% of your sales with our industry-leading commission structure.`,
  },
  {
    Icon: BarChart,
    title: 'Powerful Analytics',
    description:
      'Track your sales, customer engagement, and performance with detailed analytics (coming soon).',
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
      <div className='flex flex-col justify-center gap-2'>
        <HomeSectionTitle>Why Sell on {APP_DATA.name}?</HomeSectionTitle>

        <HomeSectionDescription>
          Join a growing community of AI creators and reach customers worldwide
        </HomeSectionDescription>
      </div>

      <Motion
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        variants={STAGGER}
        className='grid gap-4'
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
