import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'
import { ROUTES } from './constants'

export const getServerSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export const validateSession = async (callbackUrl?: string) => {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(`${ROUTES.login()}?callbackUrl=${callbackUrl}`)
  }
}
