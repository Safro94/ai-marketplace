import { EMAIL_FROM } from '@/lib/constants'
import { resend } from '@/lib/resend'
import { Purchase } from '@prisma/client'
import { AssetApproved } from './email-templates/asset-approved'
import { AssetRejected } from './email-templates/asset-rejected'
import { CreatorApplicationApproved } from './email-templates/creator-application-approved'
import { CreatorApplicationRejected } from './email-templates/creator-application-rejected'
import { CreatorAssetSell } from './email-templates/creator-asset-sell'
import { CustomerPurchaseCompleted } from './email-templates/customer-purchase-completed'
import { PlatformAssetPurchase } from './email-templates/platform-asset-purchase'

export const notifyPlatformSellCompleted = async ({
  purchase,
}: {
  purchase: Purchase
}) => {
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
  email,
}: {
  email: string
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Thank you for your puchase! Your order has been completed',
    react: CustomerPurchaseCompleted(),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyAssetApproved = async ({
  email,
  assetName,
}: {
  email: string
  assetName: string
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Congratulations! Your asset has been approved',
    react: await AssetApproved({ assetName }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyAssetRejected = async ({
  email,
  assetName,
}: {
  email: string
  assetName: string
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your asset has been rejected',
    react: await AssetRejected({ assetName }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyCreatorApplicationApproved = async ({
  email,
}: {
  email: string
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Congratulations! Your application has been approved',
    react: CreatorApplicationApproved(),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}

export const notifyCreatorApplicationRejected = async ({
  email,
  notes,
}: {
  email: string
  notes: string | undefined
}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your application has been rejected',
    react: await CreatorApplicationRejected({ notes }),
  })

  if (error) {
    console.error(error)
    throw new Error(error.toString())
  }
}
