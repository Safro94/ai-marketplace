import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { CART_COOKIE_NAME, CART_EXPIRY, ROUTES } from './lib/constants'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
