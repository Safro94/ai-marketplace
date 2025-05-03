import { createAffiliateCode } from '@/lib/affilate-codes'
import { CACHE_KEYS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { AffiliateStatus, Prisma } from '@prisma/client'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import 'server-only'

export const getAffiliateCodeByCode = async (code: string) => {
  return await prisma.affiliateCode.findUnique({
    where: { code, isDefault: true, status: AffiliateStatus.ACTIVE },
    select: {
      id: true,
      code: true,
      profileId: true,
      creatorProfileId: true,
      discountPercentage: true,
    },
  })
}

export const getDefaultAffiliateCodeById = async (
  where: Partial<Prisma.AffiliateCodeWhereInput>,
) => {
  'use cache'

  const affiliateCode = await prisma.affiliateCode.findFirst({
    where: {
      ...where,
      isDefault: true,
      status: AffiliateStatus.ACTIVE,
    },
    select: {
      code: true,
      discountPercentage: true,
    },
  })

  if (!affiliateCode) {
    throw new Error('Affiliate code not found')
  }

  unstable_cacheTag(CACHE_KEYS.defaultAffiliateCode(affiliateCode?.code))
  unstable_cacheLife('hours')

  return affiliateCode
}

export const createAffiliateCodeDAL = async ({
  id,
  currentCode,
  isCreatorCode,
  isDefault = true,
}: {
  id: string
  currentCode: string
  isDefault: boolean
  isCreatorCode: boolean
}) => {
  if (!currentCode) {
    throw new Error('Failed to get current affiliate code')
  }

  const newCode = await createAffiliateCode()
  if (!newCode) {
    throw new Error('Failed to generate affiliate code')
  }

  await prisma.affiliateCode.update({
    where: { code: currentCode },
    data: {
      isDefault: false,
      status: AffiliateStatus.INACTIVE,
    },
  })

  return await prisma.affiliateCode.create({
    data: {
      isDefault,
      code: newCode,
      ...(isCreatorCode ? { creatorProfileId: id } : { profileId: id }),
    },
  })
}

export const updateAffiliateCode = async (
  code: string,
  data: Prisma.AffiliateCodeUpdateArgs['data'],
) => {
  return await prisma.affiliateCode.update({
    where: { code },
    data,
  })
}
