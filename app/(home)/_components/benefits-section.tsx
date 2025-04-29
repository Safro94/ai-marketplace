import { Benefit } from '@/components/benefit'
import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { STAGGER, TRANSITION_DELAY } from '@/lib/constants'
import { Search, Shield, Sparkles, Zap } from 'lucide-react'

const BENEFITS = [
  {
    Icon: Search,
    title: 'All in one place',
    description:
      'Find the perfect digital assets for your next project. Prompt Engineering Systems, Custom GPTs, AI Agents, and more - all in one place.',
  },
  {
    Icon: Zap,
    title: 'Instant Access',
    description:
      'Get immediate access to your purchased assets and start implementing them in your projects.',
  },
  {
    Icon: Shield,
    title: 'Secure Transactions',
    description:
      'Our platform ensures secure payments and protects both buyers and creators.',
  },
  {
    Icon: Sparkles,
    title: 'Curated Quality',
    description:
      'Every asset is reviewed for quality and effectiveness before being listed on our marketplace.',
  },
]

export const BenefitsSection = () => {
  return (
    <HomeSection className='bg-muted grid md:grid-cols-2'>
      <HomeSectionTitleContainer className='justify-center text-left'>
        <HomeSectionTitle>Why Choose us?</HomeSectionTitle>

        <HomeSectionDescription className='text-left'>
          We&apos;re building the premier marketplace for high-quality AI
          assets. Find the perfect digital assets for your next project. Prompt
          Engineering Systems, Custom GPTs, AI Agents, and more - all in one
          place.
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
