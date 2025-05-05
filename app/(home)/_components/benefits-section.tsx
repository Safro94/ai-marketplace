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
          <Motion
            key={i}
            className='bg-background rounded-lg p-6 border flex items-center gap-4 card-hover'
            variants={{
              hidden: { opacity: 0.1, x: 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, delay: TRANSITION_DELAY * i },
              },
            }}
          >
            <div className='flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 dark:bg-primary-foreground flex items-center justify-center'>
              <Icon className='h-6 w-6 text-primary' aria-hidden='true' />
            </div>

            <div className='flex flex-col h-full'>
              <h3 className='text-xl font-semibold'>{title}</h3>
              <p className='text-muted-foreground flex-1'>{description}</p>
            </div>
          </Motion>
        ))}
      </Motion>
    </HomeSection>
  )
}
