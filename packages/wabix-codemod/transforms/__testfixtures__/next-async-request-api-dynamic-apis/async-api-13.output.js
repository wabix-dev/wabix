import { headers } from "wabix/headers";

async function MyComponent() {
  callSomething(await headers());
}
