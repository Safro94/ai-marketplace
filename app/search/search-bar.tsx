'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface Props {
  className?: string
}

export const SearchBar: FC<Props> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  // Update the handleSearch function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Create a new URLSearchParams object
      const params = new URLSearchParams(searchParams.toString())

      // Set the search query parameter
      params.set('q', searchQuery.trim())

      // Reset to page 1 when performing a new search
      params.delete('page')

      // Navigate to the search page with the query
      router.push(`/search?${params.toString()}`)
    }
  }

  // Update the clearSearch function
  const clearSearch = () => {
    setSearchQuery('')

    // Create a new URLSearchParams object without the query parameter
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')

    // Navigate to the current page without the search query
    if (params.toString()) {
      router.push(`${window.location.pathname}?${params.toString()}`)
    } else {
      router.push(window.location.pathname)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input
        type='search'
        placeholder='Search assets...'
        className='pl-9 pr-10'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8'
          onClick={clearSearch}
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </form>
  )
}
