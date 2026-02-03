import { cookies } from 'wabix/headers'

export default function Foo(): string {
  const name = cookies().get('name')
  return name
}
