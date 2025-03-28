import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const assetLicenses = await prisma.assetLicense.findMany({
      where: {
        assetId: params.id,
      },
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
