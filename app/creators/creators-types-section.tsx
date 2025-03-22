import { Check } from 'lucide-react'

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
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Who Can Become a Creator?
          </h2>

          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            We welcome creators from various backgrounds with expertise in AI
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {TYPES.map(({ title, items }) => (
            <div
              key={title}
              className='bg-background rounded-lg p-6 border border-border/50'
            >
              <h3 className='text-xl font-medium mb-4'>{title}</h3>
              <ul className='space-y-2'>
                {items.map((item) => (
                  <li key={item} className='flex items-start'>
                    <Check className='h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
