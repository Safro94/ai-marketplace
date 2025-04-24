'use server'

import { withErrorHandler } from '@/lib/actions-error-handling'
import { auth } from '@/lib/auth'
import { validateSession } from '@/lib/session'
import { headers } from 'next/headers'

export const signUserOut = withErrorHandler(async () => {
  await validateSession()

  await auth.api.signOut({
    headers: await headers(),
  })
})
