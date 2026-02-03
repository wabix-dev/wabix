import { NextResponse, NextRequest } from 'wabix/server'

export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}