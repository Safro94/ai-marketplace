import { getCart } from '@/lib/cart'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import { getServiceCharge, tryCatch } from '@/lib/utils'

export const getPurchaseAmounts = async () => {
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
      const serviceCharge = getServiceCharge(price)

      acc.totalPrice += price
      acc.totalServiceCharge += serviceCharge

      acc.purchasedAssets[asset.creator.creatorProfile?.id ?? ''] = {
        creatorAmount: price - serviceCharge,
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
