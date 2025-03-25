import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Extract search parameters
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const useCase = searchParams.get('useCase')
  const minPrice = searchParams.has('minPrice')
    ? Number(searchParams.get('minPrice'))
    : undefined
  const maxPrice = searchParams.has('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : undefined
  const minRating = searchParams.has('minRating')
    ? Number(searchParams.get('minRating'))
    : undefined
  const sortBy = searchParams.get('sortBy') || 'featured'
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '12')
  const skip = (page - 1) * limit

  try {
    // Build the where clause for filtering
    const where: any = {
      status: 'PUBLISHED',
    }

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ]
    }

    // Category filter
    if (category) {
      where.categoryId = category
    }

    // Use case filter
    if (useCase) {
      where.useCase = useCase
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // Rating filter
    if (minRating !== undefined) {
      where.averageRating = { gte: minRating }
    }

    // Determine sort order
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { averageRating: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        // "featured" - sort by a combination of factors
        orderBy = [
          { averageRating: 'desc' },
          { sales: 'desc' },
          { createdAt: 'desc' },
        ]
    }

    // Execute the query
    const [assets, totalCount] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          category: true,
          creator: {
            include: {
              user: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.asset.count({ where }),
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search assets' },
      { status: 500 },
    )
  }
}
