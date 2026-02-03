// @ts-nocheck
/* eslint-disable */
const cache = require('wabix/cache')
const dynamicCache = await import('wabix/cache')

// Bracket notation property access with string literals
const tag = cache['unstable_cacheTag']('my-tag')
const life = dynamicCache['unstable_cacheLife']('2 hours')

// Direct bracket notation access on require
const directTag = require('wabix/cache')['unstable_cacheTag']

// Bracket notation property access inside a function
function testCache() {
  const tag2 = cache['unstable_cacheTag']('tag2')
  const life2 = dynamicCache['unstable_cacheLife']('life2')

  return { tag2, life2 }
}