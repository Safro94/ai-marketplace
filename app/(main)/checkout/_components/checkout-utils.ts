import { tryCatch } from '@/lib/actions-error-handling'
import { getCart } from '@/lib/cart'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'

const getServiceCharge = ({
  price,
  commissionRate,
  discountPercentage = 0,
}: {
  price: number
  commissionRate: number
  discountPercentage?: number | null
}) => {
  if (!price) return 0

  // Calculate the service charge (before discount)
  const serviceCharge = price * (commissionRate / 100)

  // Calculate the discount amount (applied to the service charge)
  const discount = discountPercentage ? price * (discountPercentage / 100) : 0

  // Final service charge after applying the discount
  return Math.max(serviceCharge - discount, 0)
}

export const getPurchaseAmounts = async (
  discountPercentage: number | undefined | null,
) => {
  await validateSession()
  const cart = await getCart()

  const { data: assets, error } = await tryCatch(
    prisma.asset.findMany({
      where: {
        id: {
          in: cart.map((asset) => asset.assetId),
        },
        assetLicenses: {
          some: {
            license: {
              id: {
                in: cart.map((asset) => asset.assetLicenseId),
              },
            },
          },
        },
      },
      select: {
        id: true,
        creatorId: true,
        creator: {
          select: {
            creatorProfile: {
              select: {
                id: true,
                commissionRate: true,

                profile: {
                  select: {
                    user: {
                      select: {
                        email: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        assetLicenses: {
          select: {
            id: true,
            licenseId: true,
            price: true,
          },
        },
      },
    }),
  )

  if (error || !assets.length) {
    throw new Error('No assets found')
  }

  const totalAmounts = assets.reduce<{
    totalPrice: number
    totalServiceCharge: number
    purchasedAssets: {
      [key: string]: {
        creatorAmount: number
      }
    }
  }>(
    (acc, asset) => {
      const cartAsset = cart.find((item) => item.assetId === asset.id)
      const assetLicense = asset.assetLicenses.find(
        (license) => license.licenseId === cartAsset?.assetLicenseId,
      )

      const price = assetLicense?.price || 0
      const commissionRate = asset.creator.creatorProfile!.commissionRate

      const serviceCharge = getServiceCharge({
        price,
        discountPercentage,
        commissionRate,
      })

      // Calculate the creator's amount (always based on the full price)
      const creatorAmount = price - price * (commissionRate / 100)

      acc.totalPrice += price
      acc.totalServiceCharge += serviceCharge

      acc.purchasedAssets[asset.creator.creatorProfile?.id ?? ''] = {
        creatorAmount,
      }

      return acc
    },
    {
      totalPrice: 0,
      totalServiceCharge: 0,
      purchasedAssets: {},
    },
  )

  return { assets, totalAmounts, cart }
}
