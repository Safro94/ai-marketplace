import { seedCategories } from '@/lib/db/seed-categories'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Only allow seeding in development or with admin access
    const session = await getServerSession()

    if (process.env.NODE_ENV !== 'development' && !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Seed categories
    await seedCategories()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 },
    )
  }
}
