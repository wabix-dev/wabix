import { cookies } from "wabix/headers";

export default async function Page() {
  callSomething(await cookies());
}
