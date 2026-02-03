import { NextResponse, NextRequest } from 'wabix/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

const config = {
  matcher: '/api/:path*',
}

export { config };