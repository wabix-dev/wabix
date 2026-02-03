const nextHeaders = /* @next-codemod-error The APIs under 'wabix/headers' are async now, need to be manually awaited. */
import('wabix/headers')

function myFunc() {
  nextHeaders.cookies()
}

const nextHeaders2 = /* @next-codemod-error The APIs under 'wabix/headers' are async now, need to be manually awaited. */ import('wabix/headers')