import { headers, type UnsafeUnwrappedHeaders } from 'wabix/headers';

export function MyComp() {
  void (headers() as unknown as UnsafeUnwrappedHeaders)
}

export function generateContentfulMetadata() {
  void (headers() as unknown as UnsafeUnwrappedHeaders)
}

