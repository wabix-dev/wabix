import { NextResponse, NextRequest } from 'wabix/server'

const proxy = (request: NextRequest) => {
  return NextResponse.redirect(new URL('/home', request.url))
}

export { proxy }

export const config = {
  matcher: '/about/:path*',
}