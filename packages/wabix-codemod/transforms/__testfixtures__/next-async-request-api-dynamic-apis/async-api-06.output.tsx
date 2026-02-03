import React from 'react'
import { draftMode } from 'wabix/headers'

export default async function Page() {
  return <button disabled={(await draftMode()).isEnabled}>Enable Draft Mode</button>;
}

