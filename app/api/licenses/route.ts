import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const licenses = await prisma.license.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(licenses)
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 },
    )
  }
}
