import { createAffiliateCode } from '@/lib/affilate-codes'
import {
  notifyAffiliateCreatorCommissionImprovement,
  notifyAffiliateUserDiscountCode,
} from '@/services/emails/email'
import { AffiliateStatus, PrismaClient } from '@prisma/client'
import { format, isLastDayOfMonth } from 'date-fns'
import { logger } from '../lib/logger'

const prisma = new PrismaClient()

const USER_DISCOUNT_THRESHOLDS = [
  { uses: 20, discountPercent: 5 },
  { uses: 100, discountPercent: 7.5 },
  { uses: 500, discountPercent: 10 },
  { uses: 1000, discountPercent: 15 },
]

const CREATOR_COMMISSION_THRESHOLDS = [
  { sales: 0, commissionRate: 15 }, // Default
  { sales: 250, commissionRate: 12.5 },
  { sales: 1000, commissionRate: 10 },
  { sales: 2500, commissionRate: 7.5 },
  { sales: 5000, commissionRate: 5 },
]

/**
 * Main function to process monthly rewards
 */
export async function processMonthlyRewards(manualTrigger?: boolean) {
  const today = new Date()

  if (!manualTrigger && !isLastDayOfMonth(today)) {
    logger.info('Not the last day of the month. Skipping reward processing.')
    return
  }

  const monthYear = format(today, 'MMMM yyyy')
  logger.info(`Starting monthly reward processing for ${monthYear}`)

  try {
    await Promise.all([
      processUserDiscountCodes(),
      processCreatorCommissionRates(),
    ])

    logger.info(`Completed monthly reward processing for ${monthYear}`)
  } catch (error) {
    logger.error('Error processing monthly rewards:', error)
    throw error
  }
}

/**
 * Process discount codes for regular users
 */
async function processUserDiscountCodes() {
  logger.info('Processing user discount codes')

  const codes = await prisma.affiliateCode.findMany({
    where: {
      isDefault: true,
      status: AffiliateStatus.ACTIVE,
      profile: {
        isNot: null,
      },
    },
    select: {
      totalUses: true,
      profileId: true,

      profile: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  logger.info(`Found ${codes.length} active user referral codes`)

  for (const code of codes) {
    const usageCount = code.totalUses

    const highestThresholdReached = [...USER_DISCOUNT_THRESHOLDS]
      .reverse()
      .find((threshold) => usageCount >= threshold.uses)

    if (!highestThresholdReached) {
      continue // No threshold reached
    }

    const existingDiscountCode = await prisma.affiliateCode.findFirst({
      where: {
        profileId: code.profileId,
        discountPercentage: highestThresholdReached.discountPercent,
        status: {
          in: [AffiliateStatus.ACTIVE, AffiliateStatus.EXPIRED],
        },
      },
    })

    if (existingDiscountCode) {
      continue // User already has a discount code for this threshold
    }

    const discountCode = await createAffiliateCode()

    if (!discountCode) {
      throw new Error('Unable to create code')
    }

    await prisma.affiliateCode.create({
      data: {
        code: discountCode,
        discountPercentage: highestThresholdReached.discountPercent,
        status: AffiliateStatus.ACTIVE,
      },
    })

    if (!code.profile?.user.name || !code.profile?.user.email) {
      throw Error('User not found')
    }

    await notifyAffiliateUserDiscountCode({
      discountCode,
      name: code.profile.user.name,
      email: code.profile.user.email,
      totalUses: usageCount,
      thresholdReached: highestThresholdReached.uses,
      discountPercentage: highestThresholdReached.discountPercent,
    })

    logger.info(
      `Generated ${highestThresholdReached.discountPercent}% discount code for user ${code.profile.user.email}`,
    )
  }

  logger.info('Completed processing user discount codes')
}

/**
 * Process commission rates for creators
 */
async function processCreatorCommissionRates() {
  logger.info('Processing creator commission rates')

  const creatorCodes = await prisma.affiliateCode.findMany({
    where: {
      isDefault: true,
      status: AffiliateStatus.ACTIVE,
      creatorProfile: {
        isNot: null,
      },
    },
    select: {
      totalSales: true,

      creatorProfile: {
        select: {
          id: true,
          commissionRate: true,
          profile: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  })

  logger.info(`Found ${creatorCodes.length} active creator referral codes`)

  for (const creatorCode of creatorCodes) {
    const totalSales = creatorCode.totalSales

    // Determine the appropriate commission rate based on total sales
    const newCommissionTier = [...CREATOR_COMMISSION_THRESHOLDS]
      .reverse()
      .find((threshold) => totalSales >= threshold.sales)

    if (!newCommissionTier) {
      continue // This shouldn't happen, but just in case
    }

    // If the commission rate has changed, update it
    if (
      creatorCode.creatorProfile?.commissionRate !==
      newCommissionTier.commissionRate
    ) {
      const oldCommissionRate = creatorCode.creatorProfile?.commissionRate

      // Update the commission rate
      await prisma.creatorProfile.update({
        where: { id: creatorCode.creatorProfile?.id },
        data: {
          commissionRate: newCommissionTier.commissionRate,
          updatedAt: new Date(),
        },
      })

      if (
        !creatorCode.creatorProfile?.profile.user.name ||
        !creatorCode.creatorProfile?.profile.user.email
      ) {
        throw Error('User not found')
      }

      if (!oldCommissionRate) {
        throw Error('Old Commission rate not found')
      }

      await notifyAffiliateCreatorCommissionImprovement({
        totalSales,
        oldCommissionRate,
        name: creatorCode.creatorProfile?.profile.user.name,
        email: creatorCode.creatorProfile?.profile.user.email,
        salesThreshold: newCommissionTier.sales,
        newCommissionRate: newCommissionTier.commissionRate,
      })

      logger.info(
        `Updated commission rate for creator ${creatorCode.creatorProfile?.profile.user.email} from ${oldCommissionRate}% to ${newCommissionTier.commissionRate}%`,
      )
    }
  }

  logger.info('Completed processing creator commission rates')
}

// If this script is run directly
if (require.main === module) {
  processMonthlyRewards()
    .then(() => {
      logger.info('Monthly rewards processing completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Error in monthly rewards processing:', error)
      process.exit(1)
    })
}
