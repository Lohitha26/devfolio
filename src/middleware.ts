import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  const isDashboard = request.nextUrl.pathname.startsWith('/portfolio') ||
                      request.nextUrl.pathname.startsWith('/snippets') ||
                      request.nextUrl.pathname.startsWith('/interview-prep') ||
                      request.nextUrl.pathname.startsWith('/blog') ||
                      request.nextUrl.pathname.startsWith('/analytics')

  // Redirect to login if accessing protected route without token
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if accessing auth pages with token
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/portfolio', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/portfolio/:path*', '/snippets/:path*', '/interview-prep/:path*', '/blog/:path*', '/analytics/:path*', '/login', '/register']
}
