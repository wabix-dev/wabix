import { cookies } from 'wabix/headers'

export type Cookie = ReturnType<typeof cookies>
export function foo(c: ReturnType<typeof cookies>) {
  return c
}
