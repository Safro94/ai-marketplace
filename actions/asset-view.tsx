'use server'

import { updateAssetAnalytics } from '@/data-access/asset-analytics'
import { getViewedAssetsByProfile } from '@/data-access/assets'
import { updateProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { revalidateTag } from 'next/cache'

export const saveAssetDetailVisit = withErrorHandler(
  async (assetId: string, profileId?: string) => {
    if (!profileId) throw Error('Profile not found')

    const viewRelation = await getViewedAssetsByProfile(profileId, assetId)
    const isUniqueView = !viewRelation

    console.log(viewRelation, isUniqueView)
    await updateAssetAnalytics(assetId, isUniqueView)

    if (isUniqueView) {
      await updateProfile({
        where: { id: profileId },
        data: {
          viewedAssets: {
            connect: { id: assetId },
          },
        },
      })

      revalidateTag(CACHE_KEYS.viewedAssetsByProfile(assetId, profileId))
    }

    // TODO: revalidate creator dashboard analytics tag
    // revalidateTag(CACHE_KEYS.dashboardDownloads(profile?.id))
  },
)
