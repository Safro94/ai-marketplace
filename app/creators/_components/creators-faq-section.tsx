import { APP_DATA } from '@/lib/constants'
import { CreatorFAQs } from './creator-faq'

export const CreatorsFAQSection = () => {
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Frequently Asked Questions
          </h2>

          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            Everything you need to know about selling on {APP_DATA.name}
          </p>
        </div>

        <div className='max-w-3xl mx-auto'>
          <CreatorFAQs />
        </div>
      </div>
    </section>
  )
}
