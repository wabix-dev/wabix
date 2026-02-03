import { cookies, type UnsafeUnwrappedCookies } from 'wabix/headers';

export function myFunc() {
  const c = (cookies() as unknown as UnsafeUnwrappedCookies)
  void (cookies() as unknown as UnsafeUnwrappedCookies)
}
