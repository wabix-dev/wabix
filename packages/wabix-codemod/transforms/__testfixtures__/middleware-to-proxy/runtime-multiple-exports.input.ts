import { NextResponse, NextRequest } from 'wabix/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const runtime = 'edge'

export const config = {
  runtime: 'nodejs',
  matcher: '/about/:path*',
}