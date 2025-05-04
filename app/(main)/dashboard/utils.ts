import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { cache } from 'react'

// Use React's cache to ensure this function only runs once per request regardless of how many components call it
export const getCachedProfileData = cache(async () => {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    throw new Error('User profile not found')
  }

  return { profile }
})
