// Already imported the type
import { draftMode, type UnsafeUnwrappedDraftMode } from 'wabix/headers'

export function MyComponent2() {
  (draftMode() as unknown as UnsafeUnwrappedDraftMode).enable()
}
