'use server'

import {
  createFavorite,
  deleteFavorite,
  getFavorite,
} from '@/data-access/favorites'
import { getUserProfile } from '@/data-access/profile'
import { withErrorHandler } from '@/lib/actions-error-handling'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const addOrRemoveFavorite = withErrorHandler(async (assetId: string) => {
  const { user } = await validateSession()
  const profile = await getUserProfile(user.id)
  if (!profile) throw Error('Profile not found')

  // Check if already favorited
  const existingFavorite = await getFavorite(assetId, {
    where: {
      profileId_assetId: {
        profileId: profile.id,
        assetId,
      },
    },
  })

  const revalidateTags = () => {
    revalidateTag(CACHE_KEYS.assetFavorite(assetId))
    revalidateTag(CACHE_KEYS.assetById(assetId))
    revalidateTag(CACHE_KEYS.dashboardFavorites(profile.id))
  }

  if (existingFavorite) {
    await deleteFavorite(existingFavorite.id)

    revalidateTags()
    return { favorited: false }
  } else {
    await createFavorite({
      profileId: profile.id,
      assetId,
    })

    revalidateTags()

    return { favorited: true }
  }
})
