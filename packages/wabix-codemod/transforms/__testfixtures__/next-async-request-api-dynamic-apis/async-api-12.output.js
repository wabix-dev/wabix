import { cookies } from "wabix/headers";

async function MyComponent() {
  callSomething(await cookies());
}
