import { NextRequest } from 'wabix/server'

const proxy = 'existing proxy variable'

export function middleware(request: NextRequest) {
  return middleware(request) // self-reference
}

const handler = middleware
export { handler }