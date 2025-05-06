'use server'

import { updateAssetAnalytics } from '@/data-access/asset-analytics'
import { getViewedAssetsByProfile } from '@/data-access/assets'
import { getUserProfile, updateProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { getServerSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const saveAssetDetailVisit = withErrorHandler(
  async (assetId: string, viewedAssets: string[]) => {
    const session = await getServerSession()

    if (session?.user) {
      const profile = await getUserProfile(session.user.id)
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
    } else {
      //if the user has never seen the asset, update analytics
      if (!viewedAssets.includes(assetId)) {
        await updateAssetAnalytics(assetId, true)
      }
    }

    // TODO: revalidate creator dashboard analytics tag
    // revalidateTag(CACHE_KEYS.dashboardDownloads(profile?.id))
  },
)
