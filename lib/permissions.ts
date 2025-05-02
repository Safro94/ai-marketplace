import { getProfileByUserId } from '@/data-access/profile'
import { Profile, Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ROUTES } from './constants'
import { validateSession } from './session'
import { USER_TYPES } from './types'

export const isAdminOrCreator = (profile?: Profile | null) =>
  !!profile && profile.role !== Role.USER

export const validateAdminProfile = async (callbackUrl?: string) => {
  const { user } = await validateSession(callbackUrl ?? ROUTES.login())

  // Check if user is an admin
  const profile = await getProfileByUserId(user.id, {
    role: Role.ADMIN,
  })

  if (user.role !== USER_TYPES.ADMIN || !profile)
    redirect('/?error=unauthorized')

  return { profile }
}
