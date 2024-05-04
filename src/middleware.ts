import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getMe } from './modules/auth'

export async function middleware(request: NextRequest) {
  const { nextUrl } = request

  const user = await getMe()

  if (user && nextUrl.pathname.startsWith('/auth')) {
    // If the user is already logged in, redirect to the home page
    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_URL).toString(),
    )
  } else if (!user && !nextUrl.pathname.startsWith('/auth')) {
    // If the user is not logged in, redirect to the login page
    return NextResponse.redirect(
      new URL('/auth/login', process.env.NEXT_PUBLIC_URL).toString(),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
