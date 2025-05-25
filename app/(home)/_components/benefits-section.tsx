import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { STAGGER } from '@/lib/constants'
import { Goal, Shield, TrendingUp, Zap } from 'lucide-react'

const BENEFITS = [
  {
    Icon: Goal,
    title: 'Battle-Tested Results',
    description:
      'Every AI tool is tested by real professionals before listing. No broken prompts or outdated techniques.',
  },
  {
    Icon: Zap,
    title: 'Instant Implementation',
    description:
      'Copy, paste, and start using immediately. All tools come with clear instructions and examples.',
  },
  {
    Icon: Shield,
    title: 'Secure Transactions',
    description:
      'Our platform ensures secure payments and protects both buyers and creators.',
  },
  {
    Icon: TrendingUp,
    title: 'Weekly Updates',
    description:
      'New AI tools and prompt systems added every week. Stay ahead of the curve.',
  },
]

export const BenefitsSection = () => {
  return (
    <HomeSection className='bg-muted'>
      <HomeSectionTitleContainer>
        <HomeSectionTitle>Why AI Professionals Choose Us</HomeSectionTitle>

        <HomeSectionDescription className='md:max-w-3xl'>
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
