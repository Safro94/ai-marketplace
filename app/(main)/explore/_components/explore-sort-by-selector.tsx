'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EXPLORE_PARAMS } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export const ExploreSortBySelector = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [sortOption, setSortOption] = useState(
    searchParams.get(EXPLORE_PARAMS.SORT_BY) || 'featured',
  )

  // Update sort option and URL
  const handleSortChange = (value: string) => {
    setSortOption(value)

    const params = new URLSearchParams(searchParams.toString())
    params.set(EXPLORE_PARAMS.SORT_BY, value)

    // Update URL without full page reload
    window.history.pushState({}, '', `?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className='flex items-center space-x-2'>
      <p className='text-sm text-muted-foreground mr-2'>Sort by:</p>

      <Select value={sortOption} onValueChange={handleSortChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='featured'>Featured</SelectItem>
          <SelectItem value='price-low'>Price: Low to High</SelectItem>
          <SelectItem value='price-high'>Price: High to Low</SelectItem>
          <SelectItem value='rating'>Highest Rated</SelectItem>
          <SelectItem value='newest'>Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
