import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { CartItem, CheckoutPaymentDetails } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cartAssets }: { cartAssets: Pick<CartItem, 'assetId'>[] } =
    await request.json()

  if (!cartAssets || !cartAssets.length) {
    return NextResponse.json([])
  }

  try {
    const creatorsProfiles = await prisma.asset.findMany({
      where: {
        id: {
          in: cartAssets.map((asset) => asset.assetId),
        },
      },
      select: {
        creator: {
          select: {
            creatorProfile: {
              select: {
                profileId: true,
                paymentMethods: true,
              },
            },
          },
        },
      },
    })

    const result: Record<string, CheckoutPaymentDetails[]> = {}
    const uniqueCombinations = new Set<string>()

    creatorsProfiles.forEach((item) => {
      const paymentMethods = item.creator.creatorProfile?.paymentMethods || []

      // Process each payment method
      paymentMethods.forEach((method) => {
        const { provider, accountIdentifier, creatorProfileId } = method

        // Create a unique key for deduplication
        const uniqueKey = `${provider}:${accountIdentifier}:${creatorProfileId}`

        // Skip if we've already processed this combination
        if (uniqueCombinations.has(uniqueKey)) return

        // Mark this combination as processed
        uniqueCombinations.add(uniqueKey)

        if (!result[provider]) {
          result[provider] = []
        }

        result[provider].push({
          accountIdentifier,
          creatorProfileId,
        })
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error getting checkout assets:', error)
    return NextResponse.json(
      { error: 'Failed to get checkout assets' },
      { status: 500 },
    )
  }
}
