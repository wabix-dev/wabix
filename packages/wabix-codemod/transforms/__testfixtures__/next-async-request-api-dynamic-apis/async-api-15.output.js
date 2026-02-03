import { cookies } from "wabix/headers";

async function MyComponent() {
  function asyncFunction() {
    callSomething(/* @next-codemod-error Manually await this call and refactor the function to be async */
    cookies());
  }
}
