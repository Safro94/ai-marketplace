'use client'

import { Button } from '@/components/ui/button'
import { API_ROUTES } from '@/lib/constants'
import { FilterOption } from '@/lib/types'
import { Category } from '@prisma/client'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FiltersContent } from './filters-content'

interface Props {
  initialCategory?: string
}

// Update the component to use URL search params
export const AssetFilters: FC<Props> = ({ initialCategory }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<FilterOption[]>([])
  const [useCases, setUseCases] = useState<FilterOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice') || 0),
    Number(searchParams.get('maxPrice') || 300),
  ])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory
      ? [initialCategory]
      : searchParams.get('category')?.split(',') || [],
  )

  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(
    searchParams.get('useCase')?.split(',') || [],
  )

  const [selectedRatings, setSelectedRatings] = useState<string[]>(
    searchParams.get('minRating')
      ? [searchParams.get('minRating') as string]
      : [],
  )

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch categories and use cases from API
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true)

      try {
        // Fetch categories
        const categoriesResponse = await fetch(API_ROUTES.categories())

        if (categoriesResponse.ok) {
          const categoriesData: Category[] = await categoriesResponse.json()
          setCategories(categoriesData)
        }

        // Fetch use cases
        const useCasesResponse = await fetch('/api/use-cases')

        if (useCasesResponse.ok) {
          const useCasesData = await useCasesResponse.json()
          setUseCases(useCasesData)
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilterData()
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update category param
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    } else {
      params.delete('category')
    }

    // Update useCase param
    if (selectedUseCases.length > 0) {
      params.set('useCase', selectedUseCases.join(','))
    } else {
      params.delete('useCase')
    }

    // Update rating param
    if (selectedRatings.length > 0) {
      // Extract the numeric value from the rating (e.g., "4-up" -> 4)
      const minRating = selectedRatings[0].split('-')[0]
      params.set('minRating', minRating)
    } else {
      params.delete('minRating')
    }

    // Update price range params
    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString())
    } else {
      params.delete('minPrice')
    }

    if (priceRange[1] < 300) {
      params.set('maxPrice', priceRange[1].toString())
    } else {
      params.delete('maxPrice')
    }

    // Only update the URL if filters have changed
    const hasActiveFilters =
      selectedCategories.length > 0 ||
      selectedUseCases.length > 0 ||
      selectedRatings.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 300

    if (hasActiveFilters) {
      router.push(`?${params.toString()}`)
    }
  }, [
    selectedCategories,
    selectedUseCases,
    selectedRatings,
    priceRange,
    router,
    searchParams,
  ])

  const clearAllFilters = () => {
    setSelectedCategories(initialCategory ? [initialCategory] : [])
    setSelectedUseCases([])
    setSelectedRatings([])
    setPriceRange([0, 300])

    // Clear URL params and navigate to base URL
    if (initialCategory) {
      // If we have an initial category, keep it in the URL
      router.push(`?${initialCategory ? `category=${initialCategory}` : ''}`)
    } else {
      router.push(window.location.pathname)
    }
  }

  const hasActiveFilters =
    (initialCategory
      ? selectedCategories.length > 1
      : selectedCategories.length > 0) ||
    selectedUseCases.length > 0 ||
    selectedRatings.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 300

  return (
    <>
      {/* Desktop filters */}
      <div className='hidden md:block sticky top-20'>
        <FiltersContent
          initialCategory={initialCategory}
          isLoading={isLoading}
          categories={categories}
          useCases={useCases}
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
              {(initialCategory
                ? selectedCategories.length - 1
                : selectedCategories.length) +
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
              initialCategory={initialCategory}
              isLoading={isLoading}
              categories={categories}
              useCases={useCases}
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
