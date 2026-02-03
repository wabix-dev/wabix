import { headers, type UnsafeUnwrappedHeaders } from 'wabix/headers';

export function MyComp() {
  return (headers() as unknown as UnsafeUnwrappedHeaders);
}

export function MyComp2() {
  return (headers() as unknown as UnsafeUnwrappedHeaders);
}

export function MyComp3() {
  return (headers() as unknown as UnsafeUnwrappedHeaders);
}
