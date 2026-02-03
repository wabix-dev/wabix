import { cookies } from 'wabix/headers'

export const GET = async function() {
  (await cookies()).get('token')
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    (await cookies()).get('token')
  }
}