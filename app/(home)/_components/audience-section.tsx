import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'
import { STAGGER } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Briefcase, Target, TrendingUp, Users } from 'lucide-react'

const AUDIENCE = [
  {
    icon: <Briefcase className='w-6 h-6 text-purple-600' />,
    iconContainer: 'bg-purple-100',
    title: 'Business Owners',
    description:
      'Automate content creation and customer service to focus on growing your business',
  },
  {
    icon: <TrendingUp className='w-6 h-6 text-blue-600' />,
    iconContainer: 'bg-blue-100',
    title: 'Marketers',
    description:
      'Generate campaigns, copy, and social media content that converts',
  },
  {
    icon: <Users className='w-6 h-6 text-green-600' />,
    iconContainer: 'bg-green-100',
    title: 'Consultants',
    description:
      'Deliver faster results for clients with proven AI workflows and templates',
  },
  {
    icon: <Target className='w-6 h-6 text-orange-600' />,
    iconContainer: 'bg-orange-100',
    title: 'Entrepreneurs',
    description:
      'Build AI-powered processes without technical knowledge or huge budgets',
  },
]
export const AudienceSection = () => {
  return (
    <HomeSection>
      <HomeSectionTitleContainer>
        <HomeSectionTitle>Perfect For</HomeSectionTitle>
        <HomeSectionDescription className='md:max-w-3xl'>
          Whether you&apos;re scaling a business or serving clients, our AI
          tools help you work smarter
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <Motion
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        variants={STAGGER}
        className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'
      >
        {AUDIENCE.map((item, i) => (
          <Motion
            key={i}
            className='bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow'
            variants={{
              hidden: { opacity: 0, y: 150 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, delay: i * 0.3 },
              },
            }}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                item.iconContainer,
              )}
            >
              {item.icon}
            </div>

            <h3 className='text-lg font-semibold text-gray-900 dark:text-primary-foreground mb-2'>
              {item.title}
            </h3>

            <p className='text-muted-foreground text-sm'>{item.description}</p>
          </Motion>
        ))}
      </Motion>

      <div className='text-center mt-16'>
        <div className='inline-flex items-center gap-2 text-slate-500 text-sm'>
          <div className='flex -space-x-2'>
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white' />
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white' />
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 border-2 border-white' />
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 border-2 border-white' />
          </div>
          <span className='text-muted-foreground'>
            Trusted by 1000+ professionals worldwide
          </span>
        </div>
      </div>
    </HomeSection>
  )
}
