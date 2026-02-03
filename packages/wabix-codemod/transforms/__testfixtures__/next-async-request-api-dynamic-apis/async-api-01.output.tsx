import { cookies } from 'wabix/headers'

export async function MyComponent() {
  const name = (await cookies()).get('name')
  callback(name)
}

function callback(name: any) {
  console.log(name)
}
