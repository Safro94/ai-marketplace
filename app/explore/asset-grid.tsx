'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { API_ROUTES, EXPLORE_PARAMS, ROUTES } from '@/lib/constants'
import { Category, Asset as PrismaAsset, Profile, User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import reviewStar from '../../public/review-star.svg'

interface Props {
  initialCategory?: string
}

interface Asset extends PrismaAsset {
  category: Category
  creator: Profile & {
    user: User
  }
}

export const AssetGrid: FC<Props> = ({ initialCategory }) => {
  const searchParams = useSearchParams()
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const [sortOption, setSortOption] = useState(
    searchParams.get(EXPLORE_PARAMS.SORT_BY) || 'featured',
  )

  // Fetch assets when search params change
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Build the query string from search params
        const params = new URLSearchParams(searchParams.toString())

        // Add sort option if not already in params
        if (!params.has(EXPLORE_PARAMS.SORT_BY)) {
          params.set(EXPLORE_PARAMS.SORT_BY, sortOption)
        }

        // Add initial category if provided and not already in params
        if (initialCategory && !params.has(EXPLORE_PARAMS.CATEGORY)) {
          params.set(EXPLORE_PARAMS.CATEGORY, initialCategory)
        }

        const response = await fetch(
          `${API_ROUTES.search()}?${params.toString()}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch assets')
        }

        const data = await response.json()
        setAssets(data.assets)
        setPagination(data.pagination)
      } catch (err) {
        console.error('Error fetching assets:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssets()
  }, [searchParams, sortOption, initialCategory])

  // Update sort option and URL
  const handleSortChange = (value: string) => {
    setSortOption(value)

    const params = new URLSearchParams(searchParams.toString())
    params.set(EXPLORE_PARAMS.SORT_BY, value)

    // Update URL without full page reload
    window.history.pushState({}, '', `?${params.toString()}`)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(EXPLORE_PARAMS.PAGE, newPage.toString())

    // Update URL with new page
    window.location.search = params.toString()
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-destructive mb-4'>Error loading assets: {error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const clearAllFilters = () => {
    // If we have an initial category, keep it in the URL
    if (initialCategory) {
      window.location.search = `${EXPLORE_PARAMS.CATEGORY}=${initialCategory}`
    } else {
      window.location.search = ''
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-sm text-muted-foreground'>
          Showing{' '}
          <span className='font-medium text-foreground'>{assets.length}</span>{' '}
          results
        </p>

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
      </div>

      {assets.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {assets.map((asset) => (
              <Link href={`${ROUTES.assets()}/${asset.id}`} key={asset.id}>
                <Card className='h-full overflow-hidden border-border/50 card-hover'>
                  <CardHeader className='p-0'>
                    <div className='relative aspect-[4/3] w-full overflow-hidden'>
                      <Image
                        src={
                          asset.featuredImage ||
                          '/placeholder.svg?height=400&width=600'
                        }
                        alt={asset.title}
                        fill
                        className='object-cover transition-all'
                      />
                    </div>
                  </CardHeader>

                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <Badge variant='secondary' className='bg-secondary/80'>
                        {asset.category.name}
                      </Badge>

                      <span className='text-lg font-bold'>${asset.price}</span>
                    </div>

                    <h3 className='text-xl font-semibold mb-2 line-clamp-1'>
                      {asset.title}
                    </h3>

                    <p className='text-muted-foreground text-sm line-clamp-2 mb-4'>
                      {asset.description}
                    </p>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Avatar className='h-6 w-6'>
                          <AvatarImage
                            src={
                              asset.creator.avatarUrl ||
                              '/placeholder.svg?height=40&width=40'
                            }
                            alt={asset.creator.name || 'Creator'}
                          />

                          <AvatarFallback>
                            {asset.creator.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <span className='text-sm text-muted-foreground'>
                          {asset.creator.name || 'Unknown Creator'}
                        </span>
                      </div>

                      <div className='flex items-center'>
                        <Image
                          src={reviewStar}
                          width={16}
                          height={16}
                          alt='Review star'
                        />

                        <span className='text-sm font-medium'>
                          {asset.averageRating.toFixed(1)}
                        </span>

                        <span className='text-xs text-muted-foreground ml-1'>
                          ({asset.reviewCount})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
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

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

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
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>
            No assets found matching your criteria
          </p>

          <Button onClick={clearAllFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  )
}
