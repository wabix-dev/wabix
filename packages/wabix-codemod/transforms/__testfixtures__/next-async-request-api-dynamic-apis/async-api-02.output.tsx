import { draftMode } from 'wabix/headers'

export async function MyComponent() {
  (await draftMode()).enable()
}
