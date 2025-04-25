'use server'

import { downloadCreate } from '@/data-access/download'
import { getUserProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const saveDownload = withErrorHandler(
  async (assetId: string, purchaseItemId: string) => {
    const { user } = await validateSession()
    const profile = await getUserProfile(user.id)
    if (!profile) throw Error('Profile not found')

    await downloadCreate({ assetId, purchaseItemId, profileId: profile.id })
    revalidateTag(CACHE_KEYS.dashboardDownloads(profile?.id))
  },
)
