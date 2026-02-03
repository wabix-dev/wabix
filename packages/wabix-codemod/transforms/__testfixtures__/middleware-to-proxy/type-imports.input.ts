import { NextRequest, NextResponse, NextMiddleware, MiddlewareConfig } from 'wabix/server'
import type { NextMiddleware as MiddlewareType } from 'wabix/server'

export function middleware(request: NextRequest): NextMiddleware {
  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: '/api/:path*'
}

// Type usage in function parameter
function createMiddleware(): NextMiddleware {
  return (request: NextRequest) => NextResponse.next()
}

// Type alias using the imported type
type MyMiddleware = MiddlewareType