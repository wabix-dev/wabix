import { draftMode } from 'wabix/headers'

export function MyComponent2() {
  draftMode().enable()
}

export function useDraftModeEnabled() {
  draftMode().enable()
}
