import { Ratelimit } from '@upstash/ratelimit'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { CART_COOKIE_NAME, CART_EXPIRY, ROUTES } from './lib/constants'
import redis from './lib/redis'

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.RATE_LIMIT_MAX as string),
    '10 s',
  ),
  prefix: '@upstash/ratelimit',
  analytics: true,
})

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next()

  const ip = (request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')) as string

  const { success, pending } = await ratelimit.limit(`mw_${ip}`)
  event.waitUntil(pending)

  if (!success) {
    return NextResponse.rewrite(new URL(ROUTES.blocked(), request.url))
  }

  const regex = new RegExp('/api.*')

  // if it's not an API route, check the cart cookie
  if (!regex.test(request.nextUrl.pathname)) {
    if (!request.cookies.has(CART_COOKIE_NAME)) {
      response.cookies.set(CART_COOKIE_NAME, uuidv4(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: CART_EXPIRY,
        path: ROUTES.home(),
        sameSite: 'strict',
      })
    }

    return response
  }

  return response
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   */

  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|site.webmanifest|placeholder.svg).*)',
  ],
}
