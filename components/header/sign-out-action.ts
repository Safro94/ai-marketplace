'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const signUserOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  })
}
