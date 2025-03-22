'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import reviewStar from '../../public/review-star.svg'

interface Props {
  hasActiveFilters: boolean
  priceRange: number[]
  selectedCategories: string[]
  selectedRatings: string[]
  selectedUseCases: string[]
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
  setSelectedUseCases: Dispatch<SetStateAction<string[]>>
  setSelectedRatings: Dispatch<SetStateAction<string[]>>
  setPriceRange: Dispatch<SetStateAction<number[]>>
  clearAllFilters: () => void
}

const CATEGORIES = [
  { id: 'prompt-engineering', label: 'Prompt Engineering Systems' },
  { id: 'custom-gpts', label: 'Custom GPTs & AI Agents' },
  { id: 'ai-workflows', label: 'AI Workflow Automations' },
  { id: 'industry-solutions', label: 'Industry-Specific Solutions' },
  { id: 'content-templates', label: 'Content Creation Templates' },
  { id: 'data-tools', label: 'Data Analysis Tools' },
]

const USE_CASES = [
  { id: 'content-creation', label: 'Content Creation' },
  { id: 'data-analysis', label: 'Data Analysis' },
  { id: 'customer-support', label: 'Customer Support' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'product-development', label: 'Product Development' },
  { id: 'research', label: 'Research' },
]

const RATINGS = [
  { id: '4-up', label: '4.0 & up' },
  { id: '3-up', label: '3.0 & up' },
  { id: '2-up', label: '2.0 & up' },
]

export const FiltersContent: FC<Props> = ({
  hasActiveFilters,
  priceRange,
  selectedCategories,
  selectedRatings,
  selectedUseCases,
  setSelectedCategories,
  setSelectedUseCases,
  setSelectedRatings,
  setPriceRange,
  clearAllFilters,
}) => {
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  const handleUseCaseChange = (useCaseId: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(useCaseId)
        ? prev.filter((id) => id !== useCaseId)
        : [...prev, useCaseId],
    )
  }

  const handleRatingChange = (ratingId: string) => {
    setSelectedRatings((prev) =>
      prev.includes(ratingId)
        ? prev.filter((id) => id !== ratingId)
        : [...prev, ratingId],
    )
  }

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold'>Filters</h2>

        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearAllFilters}
            className='h-8 text-xs'
          >
            Clear all
          </Button>
        )}
      </div>

      <Accordion
        type='multiple'
        defaultValue={['categories', 'price', 'use-cases', 'ratings']}
        className='space-y-2'
      >
        <AccordionItem value='categories' className='border-b-0'>
          <AccordionTrigger className='py-3 text-sm font-medium'>
            Categories
          </AccordionTrigger>

          <AccordionContent>
            <div className='space-y-2 pt-1'>
              {CATEGORIES.map((category) => (
                <div key={category.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className='text-sm font-normal cursor-pointer'
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='price' className='border-b-0'>
          <AccordionTrigger className='py-3 text-sm font-medium'>
            Price Range
          </AccordionTrigger>

          <AccordionContent>
            <div className='space-y-4 pt-1'>
              <Slider
                defaultValue={[0, 300]}
                max={300}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className='py-4'
              />
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs text-muted-foreground'>$</span>
                  <Input
                    type='number'
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        Number.parseInt(e.target.value),
                        priceRange[1],
                      ])
                    }
                    className='h-8 w-16 text-xs'
                  />
                </div>

                <span className='text-xs text-muted-foreground'>to</span>

                <div className='flex items-center space-x-2'>
                  <span className='text-xs text-muted-foreground'>$</span>
                  <Input
                    type='number'
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Number.parseInt(e.target.value),
                      ])
                    }
                    className='h-8 w-16 text-xs'
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='use-cases' className='border-b-0'>
          <AccordionTrigger className='py-3 text-sm font-medium'>
            Use Cases
          </AccordionTrigger>

          <AccordionContent>
            <div className='space-y-2 pt-1'>
              {USE_CASES.map((useCase) => (
                <div key={useCase.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`usecase-${useCase.id}`}
                    checked={selectedUseCases.includes(useCase.id)}
                    onCheckedChange={() => handleUseCaseChange(useCase.id)}
                  />
                  <Label
                    htmlFor={`usecase-${useCase.id}`}
                    className='text-sm font-normal cursor-pointer'
                  >
                    {useCase.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='ratings' className='border-b-0'>
          <AccordionTrigger className='py-3 text-sm font-medium'>
            Ratings
          </AccordionTrigger>

          <AccordionContent>
            <div className='space-y-2 pt-1'>
              {RATINGS.map((rating) => (
                <div key={rating.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`rating-${rating.id}`}
                    checked={selectedRatings.includes(rating.id)}
                    onCheckedChange={() => handleRatingChange(rating.id)}
                  />
                  <Label
                    htmlFor={`rating-${rating.id}`}
                    className='text-sm font-normal cursor-pointer flex items-center'
                  >
                    <Image
                      src={reviewStar}
                      width={16}
                      height={16}
                      alt='Review star'
                      className='mr-1'
                    />

                    {rating.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
