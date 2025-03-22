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
    <section className='py-16'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>How It Works</h2>

          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            Start selling your AI assets in just a few simple steps
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {STEPS.map(({ title, description }, i) => (
            <div key={i} className='flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 relative'>
                <span className='text-lg font-bold'>{i}</span>
                <div className='absolute hidden md:block h-1 bg-secondary w-full right-0 top-1/2 -z-10 translate-x-1/2' />
              </div>

              <h3 className='text-lg font-medium mb-2'>{title}</h3>

              <p className='text-sm text-muted-foreground'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
