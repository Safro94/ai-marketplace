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
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { EXPLORE_FITLERS } from '@/lib/constants'

import { Category } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { Dispatch, FC, ReactNode, SetStateAction } from 'react'

interface Props {
  categories: Category[] | null
  useCases: { label?: string; id: string | null }[] | null
  isLoading: boolean
  hasActiveFilters: boolean
  priceRange: number[]
  maxPrice: number
  selectedCategories: string[]
  selectedRatings: string[]
  selectedUseCases: string[]
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
  setSelectedUseCases: Dispatch<SetStateAction<string[]>>
  setSelectedRatings: Dispatch<SetStateAction<string[]>>
  setPriceRange: Dispatch<SetStateAction<number[]>>
  clearAllFilters: () => void
}

const RATINGS = [
  { id: '4-up', label: '4.0 & up' },
  { id: '3-up', label: '3.0 & up' },
  { id: '2-up', label: '2.0 & up' },
]

export const FiltersContent: FC<Props> = ({
  categories,
  useCases,
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
  isLoading,
  maxPrice,
}) => {
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((slug) => slug !== categorySlug)
        : [...prev, categorySlug],
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

      {isLoading ? (
        <div className='flex flex-col gap-12'>
          <div className='h-44 flex flex-col gap-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>

          <div className='h-40 flex flex-col gap-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>

          <div className='h-36 flex flex-col gap-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>
        </div>
      ) : (
        <Accordion
          type='multiple'
          defaultValue={Object.values(EXPLORE_FITLERS).map((value) => value)}
          className='space-y-2'
        >
          <Filter
            value={EXPLORE_FITLERS.CATEGORIES}
            title='Categories'
            items={categories}
          >
            {(item) => (
              <>
                <Checkbox
                  id={`category-${item.slug}`}
                  checked={selectedCategories.includes(item.slug)}
                  onCheckedChange={() => handleCategoryChange(item.slug)}
                />

                <Label
                  htmlFor={`category-${item.slug}`}
                  className='text-sm font-normal cursor-pointer'
                >
                  {item.name}
                </Label>
              </>
            )}
          </Filter>

          <AccordionItem value={EXPLORE_FITLERS.PRICE} className='border-b-0'>
            <AccordionTrigger className='py-3 text-sm font-medium'>
              Price Range
            </AccordionTrigger>

            <AccordionContent>
              <div className='space-y-4 px-1'>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={priceRange[1]}
                  min={0}
                  step={1}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={setPriceRange}
                  className='py-4'
                />

                <div className='grid grid-cols-3 items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>$</span>
                    <Input
                      type='number'
                      min={0}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const price = Number.parseInt(e.target.value)
                        if (price > maxPrice) return

                        setPriceRange([price, priceRange[1]])
                      }}
                      className='h-8 text-xs'
                    />
                  </div>

                  <span className='text-xs text-muted-foreground text-center'>
                    to
                  </span>

                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>$</span>
                    <Input
                      type='number'
                      value={priceRange[1]}
                      max={priceRange[1]}
                      disabled
                      className='h-8 text-xs'
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <Filter
            value={EXPLORE_FITLERS.USE_CASES}
            title='Use Cases'
            items={useCases}
          >
            {(item) => (
              <>
                <Checkbox
                  id={`usecase-${item.id}`}
                  checked={selectedUseCases.includes(item.id ?? '')}
                  onCheckedChange={() => handleUseCaseChange(item.id ?? '')}
                />

                <Label
                  htmlFor={`usecase-${item.id}`}
                  className='text-sm font-normal cursor-pointer'
                >
                  {item.label}
                </Label>
              </>
            )}
          </Filter>

          <Filter
            value={EXPLORE_FITLERS.RATINGS}
            title='Ratings'
            items={RATINGS}
          >
            {(item) => (
              <>
                <Checkbox
                  id={`rating-${item.id}`}
                  checked={selectedRatings.includes(item.id)}
                  onCheckedChange={() => handleRatingChange(item.id)}
                />

                <Label
                  htmlFor={`rating-${item.id}`}
                  className='text-sm font-normal cursor-pointer flex items-center'
                >
                  <StarIcon className='h-4 w-4 fill-yellow-400 text-yellow-400 mr-1' />
                  {item.label}
                </Label>
              </>
            )}
          </Filter>
        </Accordion>
      )}
    </>
  )
}

const Filter = <T extends { id: string | null }>({
  items,
  title,
  value,
  children,
}: {
  items: T[] | null
  title: string
  value: string
  children: (item: T) => ReactNode
}) => {
  return (
    <AccordionItem value={value} className='border-b-0'>
      <AccordionTrigger className='py-3 text-sm font-medium'>
        {title}
      </AccordionTrigger>

      <AccordionContent>
        <div className='space-y-2 pt-1'>
          {items?.map((item) => (
            <div key={item.id} className='flex items-center space-x-2'>
              {children(item)}
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
