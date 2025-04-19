import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { FADE_IN_UP, STAGGER } from '@/lib/constants'
import { CheckCircle } from 'lucide-react'

const TYPES = [
  {
    title: 'AI Prompt Engineers',
    items: [
      'Create and sell advanced prompt engineering systems',
      'Share specialized prompt frameworks for different use cases',
      'Offer industry-specific prompt collections',
    ],
  },
  {
    title: 'Custom GPT Creators',
    items: [
      'Sell specialized GPTs for specific industries or tasks',
      'Create AI agents with unique capabilities',
      'Develop multi-agent systems for complex workflows',
    ],
  },
  {
    title: 'AI Workflow Developers',
    items: [
      'Create automation workflows connecting AI tools',
      'Develop integration templates for business processes',
      'Build end-to-end solutions for specific use cases',
    ],
  },
  {
    title: 'Industry Experts',
    items: [
      'Share domain-specific AI solutions for your industry',
      'Create specialized templates for professional workflows',
      'Develop AI assets that solve industry-specific challenges',
    ],
  },
]

export const CreatorsTypesSection = () => {
  return (
    <HomeSection className='bg-muted'>
      <div className='container'>
        <div className='text-center mb-12'>
          <HomeSectionTitle>Who Can Become a Creator?</HomeSectionTitle>

          <HomeSectionDescription>
            We welcome creators from various backgrounds with expertise in AI
          </HomeSectionDescription>
        </div>

        <Motion
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          variants={STAGGER}
          className='grid md:grid-cols-2 gap-8'
        >
          {TYPES.map(({ title, items }) => (
            <Motion
              key={title}
              className='bg-background rounded-lg p-6 border border-primary'
              variants={FADE_IN_UP()}
            >
              <h3 className='text-xl font-medium mb-4'>{title}</h3>
              <ul className='space-y-2'>
                {items.map((item) => (
                  <li key={item} className='flex items-start'>
                    <CheckCircle className='h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Motion>
          ))}
        </Motion>
      </div>
    </HomeSection>
  )
}
