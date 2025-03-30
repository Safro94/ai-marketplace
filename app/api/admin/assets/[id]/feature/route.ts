import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { isAdmin: true },
  })

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { featured } = await request.json()

    // Update the asset's featured status
    const asset = await prisma.asset.update({
      where: { id: params.id },
      data: {
        featured,
        // If featuring, set a default order at the end
        ...(featured
          ? {
              featuredOrder: {
                set:
                  (await prisma.asset.count({
                    where: { featured: true },
                  })) + 1,
              },
            }
          : {
              featuredOrder: { set: null },
            }),
      },
    })

    return NextResponse.json({
      success: true,
      assetId: asset.id,
      featured: asset.featured,
    })
  } catch (error) {
    console.error('Error updating featured status:', error)
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 },
    )
  }
}
