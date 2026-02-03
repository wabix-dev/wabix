import { cookies } from 'wabix/headers'

export const GET = async function() {
  cookies().get('token')
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    cookies().get('token')
  }
}
