import { cookies } from 'wabix/headers'

export type Cookie = Awaited<ReturnType<typeof cookies>>
export function foo(c: Awaited<ReturnType<typeof cookies>>) {
  return c
}

