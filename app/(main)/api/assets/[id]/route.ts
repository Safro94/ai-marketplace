import {
  deleteAssetLicensesByAssetId,
  getAssetLicensesByAssetId,
} from '@/data-access/asset-licenses'
import {
  deleteAssetById,
  getAssetById,
  updateAsset,
} from '@/data-access/assets'
import { getUserProfile } from '@/data-access/profile'
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
    const assetId = (await params).id

    // Check if user is the creator or an admin
    const asset = await getAssetById(assetId, {
      creator: true,
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const profile = await getUserProfile(session.user.id)
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

    const updatedAsset = await updateAsset({
      assetId: (await params).id,
      ...data,
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
    const asset = await getAssetById(assetId, {
      creator: true,
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const profile = await getUserProfile(session.user.id)

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

    const licenses = await getAssetLicensesByAssetId(assetId)

    for (const license of licenses) {
      await deleteAssetLicensesByAssetId(license.assetId)
    }

    await deleteAssetById(assetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 },
    )
  }
}
