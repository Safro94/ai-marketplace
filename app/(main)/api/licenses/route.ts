import { getLicenses } from '@/data-access/licenses'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const licenses = await getLicenses()

    return NextResponse.json(licenses)
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 },
    )
  }
}
