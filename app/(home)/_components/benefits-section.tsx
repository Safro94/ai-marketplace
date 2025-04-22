import { Benefit } from '@/components/benefit'
import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { STAGGER } from '@/lib/constants'
import { Shield, Sparkles, Zap } from 'lucide-react'

const BENEFITS = [
  {
    Icon: Sparkles,
    title: 'Curated Quality',
    description:
      'Every asset is reviewed for quality and effectiveness before being listed on our marketplace.',
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
]

export const BenefitsSection = () => {
  return (
    <HomeSection className='bg-muted grid md:grid-cols-2'>
      <div className='flex flex-col justify-center gap-2'>
        <HomeSectionTitle>Why Choose AIAssetHub?</HomeSectionTitle>

        <HomeSectionDescription className='mx-[initial]'>
          We&apos;re building the premier marketplace for high-quality AI assets
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
            delay={0.5 * i}
          />
        ))}
      </Motion>
    </HomeSection>
  )
}
