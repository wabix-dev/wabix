import React from 'react'
import { 
  headers,
  cookies, 
  draftMode, 
} from 'wabix/headers'

export function MyDraftComponent() {
if (draftMode().isEnabled) {
    return null
  }

  return <p>page</p>
}

export function MyCookiesComponent() {
  const c = cookies()
  return c.get('name')
}

export function MyHeadersComponent() {
  const h = headers()
  return (
    <p>{h.get('x-foo')}</p>
  )
}

