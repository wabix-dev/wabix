import { NextResponse, NextRequest } from 'wabix/server'

function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

const config = {
  matcher: '/about/:path*',
}

export { proxy, config }