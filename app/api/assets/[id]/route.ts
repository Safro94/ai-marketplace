import { getAssetById } from '@/lib/db/assets'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const asset = await getAssetById((await params).id)

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error('Error fetching asset:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Check if user is the creator or an admin
    const asset = await prisma.asset.findUnique({
      where: { id: (await params).id },
      include: {
        creator: true,
      },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isCreator = asset.creator.userId === session.user.id

    if (!isCreator && profile.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: 'Not authorized to update this asset' },
        { status: 403 },
      )
    }

    const updatedAsset = await prisma.asset.update({
      where: { id: (await params).id },
      data,
    })

    return NextResponse.json(updatedAsset)
  } catch (error) {
    console.error('Error updating asset:', error)
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const assetId = (await params).id

  try {
    // Check if user is the creator or an admin
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        creator: true,
      },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isCreator = asset.creator.userId === session.user.id

    if (!isCreator && profile.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: 'Not authorized to delete this asset' },
        { status: 403 },
      )
    }

    const licenses = await prisma.assetLicense.findMany({
      where: { assetId },
    })

    for (const license of licenses) {
      await prisma.assetLicense.deleteMany({
        where: { assetId: license.assetId },
      })
    }

    await prisma.asset.delete({
      where: { id: assetId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 },
    )
  }
}
