'use client'

import { Input } from '@/components/ui/input'
import { EXPLORE_PARAMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface Props {
  className?: string
}

export const SearchBar: FC<Props> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Update the handleSearch function
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set(EXPLORE_PARAMS.QUERY, term)
    } else {
      params.delete(EXPLORE_PARAMS.QUERY)
    }

    router.push(`?${params.toString()}`)
  }, 300)

  return (
    <div className={cn('relative', className)}>
      <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input
        type='search'
        placeholder='Search assets...'
        className='pl-10 w-full'
        defaultValue={searchParams.get(EXPLORE_PARAMS.QUERY) || ''}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
      />
    </div>
  )
}
