import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { STAGGER } from '@/lib/constants'
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
    <HomeSection className='bg-muted'>
      <HomeSectionTitleContainer>
        <HomeSectionTitle>Why Choose Our Platform</HomeSectionTitle>

        <HomeSectionDescription>
          We offer unique benefits that make our referral programs stand out
          from the rest.
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <Motion
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        variants={STAGGER}
        className='grid md:grid-cols-4 gap-4'
      >
        {BENEFITS.map(({ Icon, title, description }, i) => (
          <Motion
            key={i}
            className='bg-background rounded-lg p-6 border flex flex-col items-center gap-4 card-hover'
            variants={{
              hidden: { opacity: 0, x: 150 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.3, delay: 0.3 * i },
              },
            }}
          >
            <div className='flex-shrink-0 h-12 w-12 rounded-full bg-primary dark:bg-primary-foreground flex items-center justify-center'>
              <Icon
                className='h-6 w-6 text-white dark:text-primary'
                aria-hidden='true'
              />
            </div>

            <div className='flex flex-col text-center h-full'>
              <h3 className='text-xl font-semibold'>{title}</h3>
              <p className='text-muted-foreground flex-1'>{description}</p>
            </div>
          </Motion>
        ))}
      </Motion>
    </HomeSection>
  )
}
