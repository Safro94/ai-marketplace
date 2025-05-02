'use server'

import { updateAssetAnalytics } from '@/data-access/asset-analytics'
import { getViewedAssetsByProfile } from '@/data-access/assets'
import { getUserProfile, updateProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const saveAssetDetailVisit = withErrorHandler(
  async (assetId: string) => {
    const { user } = await validateSession()

    const profile = await getUserProfile(user.id)
    if (!profile) throw Error('Profile not found')

    const viewRelation = await getViewedAssetsByProfile(profile.id, assetId)
    const isUniqueView = !viewRelation

    await updateAssetAnalytics(assetId, isUniqueView)

    if (isUniqueView) {
      await updateProfile({
        where: { id: profile.id },
        data: {
          viewedAssets: {
            connect: { id: assetId },
          },
        },
      })

      revalidateTag(CACHE_KEYS.viewedAssetsByProfile(assetId, profile.id))
    }

    // TODO: revalidate creator dashboard analytics tag
    // revalidateTag(CACHE_KEYS.dashboardDownloads(profile?.id))
  },
)
