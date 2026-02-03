import { use } from "react";
import { cookies } from 'wabix/headers'

function useHook() {}

export default function Page() {
  useHook()
  const c = use(cookies());
}

export async function generateMetadata() {
  await cookies()
}
