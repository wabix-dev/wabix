import { cookies } from 'wabix/headers'

export default function Foo() {
  const name = cookies().get('name')
  return name
}
