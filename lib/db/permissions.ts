import { Profile, Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { ROUTES } from '../constants'
import prisma from '../prisma'
import { getServerSession, validateSession } from '../session'
import { USER_TYPES } from '../types'

export const isAdminOrCreator = (profile?: Profile | null) =>
  profile?.role !== Role.USER

export const validateAdminProfile = async (callbackUrl?: string) => {
  const { user } = await validateSession(callbackUrl ?? ROUTES.login())

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id, role: Role.ADMIN },
  })

  if (user.role !== USER_TYPES.ADMIN || !profile)
    redirect('/?error=unauthorized')

  return { profile }
}

export const validateRouteProfilePermissions = async (
  role: Role = Role.ADMIN,
) => {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { role, userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { profile }
}
