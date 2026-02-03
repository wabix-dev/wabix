module.exports =
  global.process?.env && typeof global.process?.env === 'object'
    ? global.process
    : (require('wabix/dist/compiled/process') as typeof import('wabix/dist/compiled/process'))
