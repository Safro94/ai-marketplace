import { EMAIL_FROM, EMAILS_DISABLED } from '@/lib/constants'
import { resend } from '@/lib/resend'
import { Purchase } from '@prisma/client'
import { AssetApproved } from './email-templates/asset-approved'
import { AssetRejected } from './email-templates/asset-rejected'
import { CreatorApplicationApproved } from './email-templates/creator-application-approved'
import { CreatorApplicationRejected } from './email-templates/creator-application-rejected'
import { CreatorAssetSell } from './email-templates/creator-asset-sell'
import { CreatorCommissionRateLowered } from './email-templates/creator-commission-rate-lowered'
import { CustomerPurchaseCompleted } from './email-templates/customer-purchase-completed'
import { DiscountCodeEarned } from './email-templates/discount-code-earned'
import { PlatformAssetPurchase } from './email-templates/platform-asset-purchase'

export const notifyPlatformSellCompleted = async ({
  purchase,
}: {
  purchase: Purchase
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: 'aiassethub@gmail.com',
    subject: 'Congratulations! Someone has purchased an asset',
    react: await PlatformAssetPurchase({
      ...purchase,
    }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

export const notifyCreatorSellCompleted = async ({
  creatorEmail,
  creatorUsername,
  assetName,
}: {
  creatorEmail: string
  creatorUsername: string
  assetName: string
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: creatorEmail,
    subject: 'Congratulations! Your asset has been sold',
    react: await CreatorAssetSell({
      assetName,
      creatorUsername,
    }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

export const notifyBuyerOrderCompleted = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Thank you for your puchase! Your order has been completed',
    react: await CustomerPurchaseCompleted({ name }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyAssetApproved = async ({
  name,
  email,
  assetName,
}: {
  name: string
  email: string
  assetName: string
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Congratulations! Your asset has been approved',
    react: await AssetApproved({ name, assetName }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyAssetRejected = async ({
  name,
  email,
  assetName,
}: {
  name: string
  email: string
  assetName: string
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your asset has been rejected',
    react: await AssetRejected({ name, assetName }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyCreatorApplicationApproved = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Congratulations! Your application has been approved',
    react: await CreatorApplicationApproved({ name }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyCreatorApplicationRejected = async ({
  name,
  email,
  notes,
}: {
  name: string
  email: string
  notes: string | undefined
}) => {
  if (EMAILS_DISABLED) return

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your application has been rejected',
    react: await CreatorApplicationRejected({ name, notes }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyAffiliateUserDiscountCode = async ({
  email,
  discountPercentage,
  ...rest
}: {
  name: string
  email: string
  totalUses: number
  discountCode: string
  thresholdReached: number
  discountPercentage: number
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `You've Earned a ${discountPercentage}% Discount!`,
    react: await DiscountCodeEarned({ discountPercentage, ...rest }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyAffiliateCreatorCommissionImprovement = async ({
  email,
  ...rest
}: {
  name: string
  email: string
  totalSales: number
  salesThreshold: number
  oldCommissionRate: number
  newCommissionRate: number
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your Creator Commission Rate Has Improved!',
    react: await CreatorCommissionRateLowered({ ...rest }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}
