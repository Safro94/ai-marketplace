import { getProfileByUserId, getUserProfile } from '@/data-access/profile'
import { Profile, Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { ROUTES } from './constants'
import { getServerSession, validateSession } from './session'
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

export const validateRouteProfilePermissions = async () => {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { profile, user: session.user }
}
