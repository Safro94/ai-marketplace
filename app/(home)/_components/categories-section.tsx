import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { CategoryShowcase } from './category-showcase'

export const CategoriesSection = () => {
  return (
    <HomeSection className='bg-background'>
      <HomeSectionTitleContainer>
        <HomeSectionTitle className='text-primary'>
          Browse Categories
        </HomeSectionTitle>

        <HomeSectionDescription>
          Explore our wide range of digital products across various categories
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <CategoryShowcase />
    </HomeSection>
  )
}
