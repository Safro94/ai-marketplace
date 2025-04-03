import { validateRouteProfilePermissions } from '@/lib/db/permissions'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  await validateRouteProfilePermissions()

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
