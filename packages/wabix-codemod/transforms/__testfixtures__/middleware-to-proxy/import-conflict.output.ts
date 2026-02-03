import { NextResponse } from 'wabix/server'
// @ts-expect-error: test fixture
import { proxy } from 'some-library'

export function _proxy1() {
  return NextResponse.next()
}
export { _proxy1 as proxy };