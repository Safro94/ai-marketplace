'use server'

import { auth } from '@/lib/auth'
import { validateSession } from '@/lib/session'
import { headers } from 'next/headers'

export const signUserOut = async () => {
  await validateSession()

  await auth.api.signOut({
    headers: await headers(),
  })
}
