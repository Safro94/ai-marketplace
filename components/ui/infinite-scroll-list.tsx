'use client'

import { INFINITE_SCROLL_NUMBER_OF_ITEMS } from '@/lib/constants'
import { FC, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { toast } from './toast'

interface Props<T> {
  initialData: T[]
  endpointUrl: string
  cacheTag: string
  ItemComponent: FC<T>
}

export const InfiniteScrollList = <T,>({
  initialData,
  endpointUrl,
  cacheTag,
  ItemComponent,
}: Props<T>) => {
  const [items, setItems] = useState<T[]>(initialData)
  const [page, setPage] = useState(1)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView()

  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMoreItems) return

    setIsLoading(true)

    try {
      const response = await fetch(
        `${endpointUrl}?page=${page}&limit=${INFINITE_SCROLL_NUMBER_OF_ITEMS}`,
        {
          next: {
            tags: [cacheTag],
            revalidate: 3600,
          },
        },
      )

      if (!response.ok) {
        toast.error('Error', {
          description: 'There was an error loading your data',
        })

        return
      }

      const newItems = (await response.json()) as T[]

      if (
        newItems.length === 0 ||
        newItems.length < INFINITE_SCROLL_NUMBER_OF_ITEMS
      ) {
        setHasMoreItems(false)
      }

      setItems((prevItems) => [...prevItems, ...newItems])
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error('Error loading more items:', error)

      toast.error('Error', {
        description: 'There was an error loading your data',
      })
    } finally {
      setIsLoading(false)
    }
  }, [endpointUrl, page, isLoading, hasMoreItems])

  useEffect(() => {
    if (inView) {
      loadMoreItems()
    }
  }, [inView, loadMoreItems])

  return (
    <div>
      <div className='space-y-6'>
        {items.map((item, index) => (
          <ItemComponent key={index} {...item} />
        ))}
      </div>

      <div ref={ref} className='py-4 text-center'>
        {isLoading ? 'Loading more...' : hasMoreItems ? '' : 'No more items'}
      </div>
    </div>
  )
}
