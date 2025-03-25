import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// We'll fetch unique use cases from assets
export async function GET() {
  try {
    const useCases = await prisma.asset.findMany({
      where: {
        useCase: {
          not: null,
        },
      },
      select: {
        useCase: true,
      },
      distinct: ['useCase'],
    })

    // Transform to the expected format
    const formattedUseCases = useCases
      .filter((item) => item.useCase) // Remove null values
      .map((item) => ({
        id: item.useCase,
        label: item.useCase
          ?.split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      }))

    return NextResponse.json(formattedUseCases)
  } catch (error) {
    console.error('Error fetching use cases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch use cases' },
      { status: 500 },
    )
  }
}
