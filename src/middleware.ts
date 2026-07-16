import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAdminRole, type Role } from '@/lib/roles'

// Guards the member + admin areas:
//  - no session -> /login
//  - mustChangePassword -> forced to /change-password until cleared
//  - /admin/* requires GOD or ADMIN, else bounced to /dashboard
// Marketing routes are not in the matcher, so they stay public.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token.mustChangePassword && pathname !== '/change-password') {
    return NextResponse.redirect(new URL('/change-password', req.url))
  }

  if (pathname.startsWith('/admin') && !isAdminRole(token.role as Role)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/change-password'],
}
