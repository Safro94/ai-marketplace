import { getUserProfile } from '@/data-access/profile'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'

export const validateRouteProfilePermissions = async () => {
  const session = await getServerSession()

  if (!session?.user) {
    throw new Error('Unauthorized', { cause: 401 })
  }

  const profile = await getUserProfile(session.user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    throw new Error('Forbidden', { cause: 403 })
  }

  return { profile, user: session.user }
}
