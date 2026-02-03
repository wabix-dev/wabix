import React from 'react'
import { draftMode } from 'wabix/headers'

export default function Page() {
  return <button disabled={draftMode().isEnabled}>Enable Draft Mode</button>
}
