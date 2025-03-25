import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only track visits to asset pages
  if (request.nextUrl.pathname.startsWith('/assets/')) {
    // Create a response object
    const response = NextResponse.next()

    // Generate a unique session ID if one doesn't exist
    const sessionId =
      request.cookies.get('session_id')?.value ||
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)

    // Set the session ID cookie if it doesn't exist
    if (!request.cookies.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    // Track the page visit asynchronously
    fetch(`${request.nextUrl.origin}/api/analytics/page-visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: request.nextUrl.pathname,
        sessionId,
        referrer: request.headers.get('referer') || '',
        userAgent: request.headers.get('user-agent') || '',
      }),
    }).catch((err) => console.error('Error tracking page visit:', err))

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/assets/:path*'],
}
