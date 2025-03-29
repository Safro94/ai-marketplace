'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

export const HeaderSearchbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      {isSearchOpen ? (
        <div className='hidden md:flex items-center relative'>
          <Input
            type='search'
            placeholder='Search assets...'
            className='w-[200px] lg:w-[300px]'
          />

          <Button
            variant='ghost'
            size='icon'
            className='absolute right-0'
            onClick={() => setIsSearchOpen(false)}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <Button
          variant='ghost'
          size='icon'
          className='hidden md:flex'
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className='h-5 w-5' />
          <span className='sr-only'>Search</span>
        </Button>
      )}
    </>
  )
}
