'use server'

import { downloadCreate } from '@/data-access/download'
import { getUserProfile } from '@/data-access/profile'
import { withServerActionErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const saveDownload = withServerActionErrorHandler(
  async (assetId: string, purchaseItemId: string) => {
    const { user } = await validateSession()
    const profile = await getUserProfile(user.id)
    if (!profile) throw Error('Profile not found')

    try {
      await downloadCreate({ assetId, purchaseItemId, profileId: profile.id })

      revalidateTag(CACHE_KEYS.dashboardDownloads(profile?.id))
    } catch (e) {
      console.error(e)
      throw Error('There was an error while downloading your asset')
    }
  },
)
