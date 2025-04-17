'use server'

import {
  createFavorite,
  deleteFavorite,
  getFavorite,
} from '@/data-access/favorites'
import { getUserProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'

export const addOrRemoveFavorite = async (assetId: string) => {
  const { user } = await validateSession()
  const profile = await getUserProfile(user.id)
  if (!profile) throw Error('Profile not found')

  try {
    // Check if already favorited
    const existingFavorite = await getFavorite(assetId, {
      where: {
        userId_assetId: {
          userId: profile.id,
          assetId,
        },
      },
    })

    if (existingFavorite) {
      await deleteFavorite(existingFavorite.id)

      revalidateTag(CACHE_KEYS.assetFavorite(assetId))
      revalidateTag(CACHE_KEYS.dashboardFavorites(profile.id))

      return { favorited: false }
    } else {
      await createFavorite({
        userId: profile.id,
        assetId,
      })

      revalidateTag(CACHE_KEYS.assetFavorite(assetId))
      revalidateTag(CACHE_KEYS.dashboardFavorites(profile.id))

      return { favorited: true }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    throw Error('Failed to toggle favorite')
  }
}
