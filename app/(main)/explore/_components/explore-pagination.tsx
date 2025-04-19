'use client'

import { Button } from '@/components/ui/button'
import { EXPLORE_PARAMS, Pagination } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'

interface Props {
  pagination: Pagination | undefined
}

export const ExplorePagination: FC<Props> = ({ pagination }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(EXPLORE_PARAMS.PAGE, newPage.toString())

    // Update URL with new page
    window.location.search = params.toString()
    router.refresh()
  }

  return (
    <>
      {pagination && pagination.totalPages > 1 && (
        <div className='flex justify-center mt-8'>
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </Button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
