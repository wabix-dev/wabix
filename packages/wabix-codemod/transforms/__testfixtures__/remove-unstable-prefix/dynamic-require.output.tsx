// @ts-nocheck
/* eslint-disable */
function loadCache() {
  // Dynamic require with destructuring
  const { cacheTag, cacheLife } = require('wabix/cache')

  // Dynamic require with property access
  const cache = require('wabix/cache')
  const directTag = cache.cacheTag
  const directLife = cache.cacheLife

  // Direct property access on require
  const tag = require('wabix/cache').cacheTag('my-tag')
  const life = require('wabix/cache').cacheLife('2 hours')

  return { tag, life, directTag, directLife }
}