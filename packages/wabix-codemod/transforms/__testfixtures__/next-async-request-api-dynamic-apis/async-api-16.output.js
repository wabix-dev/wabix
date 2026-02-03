import { cookies } from "wabix/headers";

function MyComponent() {
  callSomething(/* @next-codemod-error Manually await this call and refactor the function to be async */
  cookies());
}
