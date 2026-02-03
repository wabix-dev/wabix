import { NextResponse, NextRequest } from 'wabix/server'

export async function proxy(request: NextRequest) {
  const response = await fetch('/api/auth')
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}