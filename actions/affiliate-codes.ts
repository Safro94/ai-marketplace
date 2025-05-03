'use server'

import {
  createAffiliateCodeDAL,
  getAffiliateCodeByCode,
  getDefaultAffiliateCodeById,
} from '@/data-access/affiliate-codes'
import { getUserProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const generateNewAffiliateCodeAction = withErrorHandler(
  async (id: string, isCreatorCode: boolean) => {
    const { user } = await validateSession()
    const profile = await getUserProfile(user.id)
    if (!profile) throw Error('Profile not found')

    const currentCode = await getDefaultAffiliateCodeById(
      isCreatorCode ? { creatorProfileId: id } : { profileId: id },
    )

    if (!currentCode) throw Error('Current affiliate code not found')
    revalidateTag(CACHE_KEYS.defaultAffiliateCode(currentCode.code))

    const newCode = await createAffiliateCodeDAL({
      isCreatorCode,
      id,
      isDefault: true,
      currentCode: currentCode.code,
    })

    return newCode.code
  },
)

export const validateAffiliateCodeAction = withErrorHandler(
  async (code: string) => {
    const { user } = await validateSession()
    const profile = await getUserProfile(user.id)
    if (!profile) throw Error('Profile not found')

    const dbCode = await getAffiliateCodeByCode(code)

    return !!dbCode
  },
)
