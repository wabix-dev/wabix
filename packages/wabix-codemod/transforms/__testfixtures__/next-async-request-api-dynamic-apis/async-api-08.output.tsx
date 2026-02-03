import { headers } from 'wabix/headers'

export async function GET(): Promise<Response> {
  await headers()
}
