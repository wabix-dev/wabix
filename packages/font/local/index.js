// Validate next version
const semver = require('wabix/dist/compiled/semver')
if (semver.lt(require('wabix/package.json').version, '13.0.0')) {
  throw new Error('`@next/font` is only available in Next.js 13 and newer.')
}

let message = '@wabix/font/local failed to run or is incorrectly configured.'
if (process.env.NODE_ENV === 'development') {
  message +=
    '\nIf you just installed `@next/font`, please try restarting `next dev` and resaving your file.'
}

message += `\n\nRead more: https://nextjs.org/docs/app/building-your-application/optimizing/fonts`

throw new Error(message)
