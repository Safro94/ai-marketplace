import { auth } from '@/lib/auth'
import { ROUTES } from '@/lib/constants'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest, NextResponse } from 'next/server'

// export const { POST, GET } = toNextJsHandler(auth)
export const { POST } = toNextJsHandler(auth)

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get('error')

  if (error === 'access_denied') {
    return NextResponse.redirect(new URL(ROUTES.home(), req.url))
  }

  const res = await auth.handler(req)
  return res
}
