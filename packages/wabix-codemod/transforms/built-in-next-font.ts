import type { API, FileInfo, Options } from 'jscodeshift'
import { createParserFromPath } from '../lib/parser'

export default function transformer(
  file: FileInfo,
  _api: API,
  options: Options
) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)
  let hasChanges = false

  // Before: import { ... } from '@wabix/font'
  // After: import { ... } from 'wabix/font'
  root
    .find(j.ImportDeclaration, {
      source: { value: '@wabix/font' },
    })
    .forEach((fontImport) => {
      hasChanges = true
      fontImport.node.source = j.stringLiteral('wabix/font')
    })

  // Before: import { ... } from '@wabix/font/google'
  // After: import { ... } from 'wabix/font/google'
  root
    .find(j.ImportDeclaration, {
      source: { value: '@wabix/font/google' },
    })
    .forEach((fontImport) => {
      hasChanges = true
      fontImport.node.source = j.stringLiteral('wabix/font/google')
    })

  // Before: import localFont from '@wabix/font/local'
  // After: import localFont from 'wabix/font/local'
  root
    .find(j.ImportDeclaration, {
      source: { value: '@wabix/font/local' },
    })
    .forEach((fontImport) => {
      hasChanges = true
      fontImport.node.source = j.stringLiteral('wabix/font/local')
    })

  return hasChanges ? root.toSource(options) : file.source
}
