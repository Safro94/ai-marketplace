'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FiltersContent } from './filters-content'

export const AssetFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 300])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedUseCases([])
    setSelectedRatings([])
    setPriceRange([0, 300])
  }, [])

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedUseCases.length > 0 ||
    selectedRatings.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 300

  return (
    <>
      {/* Desktop filters */}
      <div className='hidden md:block sticky top-20'>
        <FiltersContent
          hasActiveFilters={hasActiveFilters}
          priceRange={priceRange}
          selectedCategories={selectedCategories}
          selectedRatings={selectedRatings}
          selectedUseCases={selectedUseCases}
          setSelectedCategories={setSelectedCategories}
          setSelectedRatings={setSelectedRatings}
          setSelectedUseCases={setSelectedUseCases}
          setPriceRange={setPriceRange}
          clearAllFilters={clearAllFilters}
        />
      </div>

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
              {selectedCategories.length +
                selectedUseCases.length +
                selectedRatings.length +
                (priceRange[0] > 0 || priceRange[1] < 300 ? 1 : 0)}
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
              hasActiveFilters={hasActiveFilters}
              priceRange={priceRange}
              selectedCategories={selectedCategories}
              selectedRatings={selectedRatings}
              selectedUseCases={selectedUseCases}
              setSelectedCategories={setSelectedCategories}
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
