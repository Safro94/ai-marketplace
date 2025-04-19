import { getAssets } from '@/data-access/assets'
import { getCart } from '@/lib/cart'
import { getServerSession } from '@/lib/session'
import { CheckoutPaymentDetails } from '@/lib/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession()
  const cart = await getCart()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const creatorsProfiles = await getAssets({
      where: {
        id: {
          in: cart.map((asset) => asset.assetId),
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
