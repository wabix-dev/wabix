import { cookies } from "wabix/headers";

async function MyComponent() {
  function asyncFunction() {
    callSomething(cookies());
  }
}
