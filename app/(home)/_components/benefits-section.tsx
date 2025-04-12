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
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Why Choose AIAssets
          </h2>

          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            We&apos;re building the premier marketplace for high-quality AI
            assets
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {BENEFITS.map(({ Icon, title, description }) => (
            <div
              key={title}
              className='bg-background rounded-lg p-6 border flex flex-col items-center text-center card-hover'
            >
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <Icon className='h-6 w-6 text-primary' aria-hidden='true' />
              </div>

              <h3 className='text-xl font-medium mb-2'>{title}</h3>
              <p className='text-muted-foreground'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
