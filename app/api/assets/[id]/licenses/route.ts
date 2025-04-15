import { getAssetLicensesByAssetId } from '@/data-access/asset-licenses'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const assetId = (await params).id

  try {
    const assetLicenses = await getAssetLicensesByAssetId(assetId, {
      include: {
        license: true,
      },
      orderBy: {
        price: 'asc',
      },
    })

    // Format the response
    const licenseOptions = assetLicenses.map((assetLicense) => ({
      id: assetLicense.id,
      licenseId: assetLicense.licenseId,
      name: assetLicense.license.name,
      description: assetLicense.license.description,
      features: assetLicense.license.features,
      price: assetLicense.price,
    }))

    return NextResponse.json(licenseOptions)
  } catch (error) {
    console.error('Error fetching asset licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch license options' },
      { status: 500 },
    )
  }
}
