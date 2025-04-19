import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { CategoryShowcase } from './category-showcase'

export const CategoriesSection = () => {
  return (
    <HomeSection className='bg-primary'>
      <div className='text-center mb-12'>
        <HomeSectionTitle className='text-white'>
          Browse by Category
        </HomeSectionTitle>

        <HomeSectionDescription className='text-muted-foreground-primary-bg mt-2'>
          Explore our curated categories of AI assets designed for specific use
          cases
        </HomeSectionDescription>
      </div>

      <CategoryShowcase />
    </HomeSection>
  )
}
