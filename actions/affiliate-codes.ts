'use server'

import { createAffiliateCodeDAL } from '@/data-access/affiliate-codes'
import { getUserProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const generateNewAffiliateCodeAction = withErrorHandler(
  async (creatorProfileId: string, isCreatorCode: boolean) => {
    const { user } = await validateSession()
    const profile = await getUserProfile(user.id)
    if (!profile) throw Error('Profile not found')

    const newCode = await createAffiliateCodeDAL(creatorProfileId, true)

    if (isCreatorCode) {
      revalidateTag(
        CACHE_KEYS.creatorProfileDefaultAffiliateCode(creatorProfileId),
      )
    }

    return newCode.code
  },
)
