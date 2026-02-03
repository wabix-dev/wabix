import { cookies, type UnsafeUnwrappedCookies } from 'wabix/headers';

export default function Foo(): string {
  const name = (cookies() as unknown as UnsafeUnwrappedCookies).get('name')
  return name
}
