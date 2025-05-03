import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export const validateCreatorDashboardAccess = async () => {
  const { user } = await validateSession(ROUTES.creatorDashboard())
  const profile = await getUserProfile(user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  return { profile }
}
