import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { APP_DATA } from '@/lib/constants'
import { CreatorFAQs } from './creator-faq'

export const CreatorsFAQSection = () => {
  return (
    <HomeSection className='grid md:grid-cols-[1fr_2fr] gap-8 bg-primary text-white'>
      <div className='self-center'>
        <HomeSectionTitle>Frequently Asked Questions</HomeSectionTitle>

        <HomeSectionDescription className='text-muted-foreground-primary-bg'>
          Everything you need to know about selling on {APP_DATA.name}
        </HomeSectionDescription>
      </div>

      <div>
        <CreatorFAQs />
      </div>
    </HomeSection>
  )
}
