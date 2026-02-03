import { cookies } from 'wabix/headers'

export const myFun = async (): Promise<any> => {
  const name = cookies().get('name')
}
