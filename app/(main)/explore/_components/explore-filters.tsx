'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ExploreFilters as ExploreFiltersType } from '@/lib/types'
import { StarIcon } from 'lucide-react'
import { Dispatch, FC, ReactNode, SetStateAction } from 'react'

interface Props {
  filters: ExploreFiltersType
  setFilters: Dispatch<SetStateAction<ExploreFiltersType>>
}

enum EXPLORE_FITLERS {
  CATEGORIES = 'categories',
  PRICE = 'price',
  USE_CASES = 'use-cases',
  RATINGS = 'ratings',
}

const RATINGS = [
  { id: 4, label: '4+' },
  { id: 3, label: '3+' },
  { id: 2, label: '2+' },
]

export const ExploreFilters: FC<Props> = ({ filters, setFilters }) => {
  const handleRatingChange = (ratingId: number) => {
    setFilters((prevState) => ({
      ...prevState,
      rating: prevState.rating.includes(ratingId)
        ? prevState.rating.filter((id) => id !== ratingId)
        : [...prevState.rating, ratingId],
    }))
  }

  const maxPrice = filters.priceRange[1]

  return (
    <div className='bg-background z-50 p-4 h-full'>
      <Accordion
        type='multiple'
        defaultValue={Object.values(EXPLORE_FITLERS).map((value) => value)}
        className='space-y-2'
      >
        <AccordionItem value={EXPLORE_FITLERS.PRICE} className='border-b-0'>
          <AccordionTrigger className='text-sm text-muted-foreground uppercase font-semibold'>
            Price Range
          </AccordionTrigger>

          <AccordionContent>
            <div className='space-y-4'>
              <div className='p-4'>
                <Slider
                  defaultValue={[filters.priceRange[0], maxPrice]}
                  max={maxPrice}
                  min={0}
                  step={1}
                  value={[filters.priceRange[0], maxPrice]}
                  onValueChange={(e) => {
                    setFilters((prevState) => ({
                      ...prevState,
                      priceRange: e,
                    }))
                  }}
                />
              </div>

              <div className='grid grid-cols-3 items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-muted-foreground'>$</span>
                  <Input
                    type='number'
                    min={0}
                    max={maxPrice}
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const price = Number.parseInt(e.target.value)
                      if (price > maxPrice) return

                      setFilters((prevState) => ({
                        ...prevState,
                        priceRange: [price, maxPrice],
                      }))
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
                    value={maxPrice}
                    max={maxPrice}
                    disabled
                    className='h-8 text-xs'
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <Filter value={EXPLORE_FITLERS.RATINGS} title='Ratings' items={RATINGS}>
          {(item) => (
            <>
              <Checkbox
                id={`rating-${item.id}`}
                checked={filters.rating.includes(item.id)}
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
    </div>
  )
}

const Filter = <T extends { id: number | null }>({
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
      <AccordionTrigger className='text-sm text-muted-foreground uppercase font-semibold'>
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
