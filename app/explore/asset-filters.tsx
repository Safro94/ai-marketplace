'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { API_ROUTES, EXPLORE_PARAMS } from '@/lib/constants'
import { Category } from '@prisma/client'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FiltersContent } from './filters-content'

interface Props {
  initialCategory?: string
}

export const AssetFilters: FC<Props> = ({ initialCategory }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [useCases, setUseCases] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get(EXPLORE_PARAMS.MIN_PRICE) || 0),
    Number(searchParams.get(EXPLORE_PARAMS.MAX_PRICE) || 300), //TODO: get dynamic max price
  ])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory
      ? [initialCategory]
      : searchParams.get(EXPLORE_PARAMS.CATEGORY)?.split(',') || [],
  )

  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(
    searchParams.get(EXPLORE_PARAMS.USE_CASES)?.split(',') || [],
  )

  const [selectedRatings, setSelectedRatings] = useState<string[]>(
    searchParams.get(EXPLORE_PARAMS.MIN_RATING)
      ? [searchParams.get(EXPLORE_PARAMS.MIN_RATING) as string]
      : [],
  )

  // Fetch categories and use cases from API
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true)

      try {
        const categoriesResponse = await fetch(API_ROUTES.categories())

        if (categoriesResponse.ok) {
          const categoriesData: Category[] = await categoriesResponse.json()
          setCategories(categoriesData)
        }

        const useCasesResponse = await fetch(API_ROUTES.cases())

        if (useCasesResponse.ok) {
          const useCasesData = await useCasesResponse.json()
          setUseCases(useCasesData)
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)

        toast.error('Error', {
          description:
            'There was an error while fetching the categories and use cases',
        })
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
    if (!!selectedCategories.length) {
      params.set(EXPLORE_PARAMS.CATEGORY, selectedCategories.join(','))
    } else {
      params.delete(EXPLORE_PARAMS.CATEGORY)
    }

    // Update useCase param
    if (!!selectedUseCases.length) {
      params.set(EXPLORE_PARAMS.USE_CASES, selectedUseCases.join(','))
    } else {
      params.delete(EXPLORE_PARAMS.USE_CASES)
    }

    // Update rating param
    if (!!selectedRatings.length) {
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

    if (priceRange[1] < 300) {
      params.set(EXPLORE_PARAMS.MAX_PRICE, priceRange[1].toString())
    } else {
      params.delete(EXPLORE_PARAMS.MAX_PRICE)
    }

    router.push(`?${params.toString()}`)
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
    setPriceRange([0, 300]) //TODO: use dynamic price

    // Clear URL params and navigate to base URL
    if (initialCategory) {
      // If we have an initial category, keep it in the URL
      router.push(
        `?${initialCategory ? `${EXPLORE_PARAMS.CATEGORY}=${initialCategory}` : ''}`,
      )
    } else {
      router.push(window.location.pathname)
    }
  }

  const hasActiveFilters =
    (initialCategory
      ? selectedCategories.length > 1
      : !!selectedCategories.length) ||
    !!selectedUseCases.length ||
    !!selectedRatings.length ||
    !!priceRange[0] ||
    priceRange[1] < 300 //TODO: use dynamic price

  return (
    <>
      {/* Desktop filters */}
      <div className='hidden md:block sticky top-20'>
        <FiltersContent
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
              {/* //TODO: use dynamic price */}
              {(initialCategory
                ? selectedCategories.length - 1
                : selectedCategories.length) +
                selectedUseCases.length +
                selectedRatings.length +
                (!!priceRange[0] || priceRange[1] < 300 ? 1 : 0)}
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
