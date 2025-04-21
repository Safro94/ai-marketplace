'use client'

import { Button } from '@/components/ui/button'
import { EXPLORE_PARAMS } from '@/lib/types'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FiltersContent } from './filters-content'

interface Props {
  maxPrice: number
  showDesktopFilters?: boolean
}

export const AssetFilters: FC<Props> = ({ maxPrice, showDesktopFilters }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get(EXPLORE_PARAMS.MIN_PRICE)) || 0,
    maxPrice,
  ])

  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(
    searchParams.get(EXPLORE_PARAMS.USE_CASES)?.split(',') || [],
  )

  const [selectedRatings, setSelectedRatings] = useState<string[]>(
    searchParams.get(EXPLORE_PARAMS.MIN_RATING)
      ? [searchParams.get(EXPLORE_PARAMS.MIN_RATING) as string]
      : [],
  )

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update useCase param
    if (selectedUseCases.length) {
      params.set(EXPLORE_PARAMS.USE_CASES, selectedUseCases.join(','))
    } else {
      params.delete(EXPLORE_PARAMS.USE_CASES)
    }

    // Update rating param
    if (selectedRatings.length) {
      // Extract the numeric value from the rating (e.g., "4-up" -> 4)
      const minRating = selectedRatings[0].split('-')[0]
      params.set(EXPLORE_PARAMS.MIN_RATING, minRating)
    } else {
      params.delete(EXPLORE_PARAMS.MIN_RATING)
    }

    // Update price range params
    if (!!priceRange[0]) {
      params.set(EXPLORE_PARAMS.MIN_PRICE, priceRange[0].toString())
    } else {
      params.delete(EXPLORE_PARAMS.MIN_PRICE)
    }

    router.push(`?${params.toString()}`)
  }, [
    selectedUseCases,
    selectedRatings,
    priceRange,
    router,
    searchParams,
    maxPrice,
  ])

  const clearAllFilters = () => {
    setSelectedUseCases([])
    setSelectedRatings([])
    setPriceRange([0, maxPrice])
  }

  const hasActiveFilters =
    !!selectedUseCases.length ||
    !!selectedRatings.length ||
    !!priceRange[0] ||
    priceRange[1] < maxPrice

  return (
    <>
      {showDesktopFilters && (
        <div className='hidden md:block bg-background z-50 w-[350px] p-4 h-full'>
          <FiltersContent
            maxPrice={maxPrice}
            hasActiveFilters={hasActiveFilters}
            priceRange={priceRange}
            selectedRatings={selectedRatings}
            selectedUseCases={selectedUseCases}
            setSelectedRatings={setSelectedRatings}
            setSelectedUseCases={setSelectedUseCases}
            setPriceRange={setPriceRange}
            clearAllFilters={clearAllFilters}
          />
        </div>
      )}

      {/* Mobile filters button */}
      <div className='md:hidden mb-4'>
        <Button
          variant='outline'
          onClick={() => setShowMobileFilters(true)}
          className='w-full'
        >
          Filters
          {hasActiveFilters && (
            <span className='ml-2 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-white'>
              {selectedUseCases.length +
                selectedRatings.length +
                (!!priceRange[0] || priceRange[1] < maxPrice ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile filters overlay */}
      {showMobileFilters && (
        <div className='fixed inset-0 bg-background z-50 md:hidden overflow-y-auto'>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold'>Filters</h2>

              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowMobileFilters(false)}
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            <FiltersContent
              maxPrice={maxPrice}
              hasActiveFilters={hasActiveFilters}
              priceRange={priceRange}
              selectedRatings={selectedRatings}
              selectedUseCases={selectedUseCases}
              setSelectedRatings={setSelectedRatings}
              setSelectedUseCases={setSelectedUseCases}
              setPriceRange={setPriceRange}
              clearAllFilters={clearAllFilters}
            />

            <div className='mt-6 grid grid-cols-2 gap-4'>
              <Button variant='outline' onClick={clearAllFilters}>
                Clear all
              </Button>

              <Button onClick={() => setShowMobileFilters(false)}>
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
