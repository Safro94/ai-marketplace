import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Motion } from '@/components/ui/motion'

const STEPS = [
  {
    title: 'Apply',
    description: 'Submit your application to become a creator on our platform.',
  },
  {
    title: 'Create',
    description:
      'Upload your AI assets and set your pricing and licensing terms.',
  },
  {
    title: 'Publish',
    description:
      'After review, your assets will be published on our marketplace.',
  },
  {
    title: 'Earn',
    description: 'Start earning revenue as customers purchase your assets.',
  },
]

export const CreatorsHowItWorksSection = () => {
  return (
    <HomeSection>
      <div className='container'>
        <div className='text-center mb-12'>
          <HomeSectionTitle>How It Works</HomeSectionTitle>

          <HomeSectionDescription>
            Start selling your AI assets in just a few simple steps
          </HomeSectionDescription>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {STEPS.map(({ title, description }, i) => (
            <Motion
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className='flex flex-col items-center text-center relative'
            >
              <div className='h-14 w-14 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center mb-5 shadow-lg'>
                <span className='text-lg font-bold text-primary-foreground'>
                  {i + 1}
                </span>
              </div>

              <h3 className='text-xl font-semibold mb-3 tracking-tight'>
                {title}
              </h3>

              <p className='text-sm text-muted-foreground max-w-xs'>
                {description}
              </p>
            </Motion>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
