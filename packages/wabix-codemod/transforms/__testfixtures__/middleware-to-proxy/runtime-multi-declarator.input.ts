import { NextResponse, NextRequest } from 'wabix/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

const runtime = 'edge', config = { matcher: '/test/*' }
export { runtime, config }