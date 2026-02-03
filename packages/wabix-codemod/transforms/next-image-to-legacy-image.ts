import type { API, FileInfo, Options } from 'jscodeshift'
import { createParserFromPath } from '../lib/parser'

export default function transformer(
  file: FileInfo,
  _api: API,
  options: Options
) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  // Before: import Image from "wabix/image"
  //  After: import Image from "wabix/legacy/image"
  root
    .find(j.ImportDeclaration, {
      source: { value: 'wabix/image' },
    })
    .forEach((imageImport) => {
      imageImport.node.source = j.stringLiteral('wabix/legacy/image')
    })
  // Before: const Image = await import("wabix/image")
  //  After: const Image = await import("wabix/legacy/image")
  root.find(j.AwaitExpression).forEach((awaitExp) => {
    const arg = awaitExp.value.argument
    if (arg?.type === 'CallExpression' && arg.callee.type === 'Import') {
      if (
        arg.arguments[0].type === 'StringLiteral' &&
        arg.arguments[0].value === 'wabix/image'
      ) {
        arg.arguments[0] = j.stringLiteral('wabix/legacy/image')
      }
    }
  })

  // Before: import Image from "wabix/future/image"
  //  After: import Image from "wabix/image"
  root
    .find(j.ImportDeclaration, {
      source: { value: 'wabix/future/image' },
    })
    .forEach((imageFutureImport) => {
      imageFutureImport.node.source = j.stringLiteral('wabix/image')
    })

  // Before: const Image = await import("wabix/future/image")
  //  After: const Image = await import("wabix/image")
  root.find(j.AwaitExpression).forEach((awaitExp) => {
    const arg = awaitExp.value.argument
    if (arg?.type === 'CallExpression' && arg.callee.type === 'Import') {
      if (
        arg.arguments[0].type === 'StringLiteral' &&
        arg.arguments[0].value === 'wabix/future/image'
      ) {
        arg.arguments[0] = j.stringLiteral('wabix/image')
      }
    }
  })

  // Before: const Image = require("wabix/image")
  //  After: const Image = require("wabix/legacy/image")
  root.find(j.CallExpression).forEach((requireExp) => {
    if (
      requireExp?.value?.callee?.type === 'Identifier' &&
      requireExp.value.callee.name === 'require'
    ) {
      let firstArg = requireExp.value.arguments[0]
      if (
        firstArg &&
        firstArg.type === 'StringLiteral' &&
        firstArg.value === 'wabix/image'
      ) {
        requireExp.value.arguments[0] = j.stringLiteral('wabix/legacy/image')
      }
    }
  })

  // Before: const Image = require("wabix/future/image")
  //  After: const Image = require("wabix/image")
  root.find(j.CallExpression).forEach((requireExp) => {
    if (
      requireExp?.value?.callee?.type === 'Identifier' &&
      requireExp.value.callee.name === 'require'
    ) {
      let firstArg = requireExp.value.arguments[0]
      if (
        firstArg &&
        firstArg.type === 'StringLiteral' &&
        firstArg.value === 'wabix/future/image'
      ) {
        requireExp.value.arguments[0] = j.stringLiteral('wabix/image')
      }
    }
  })

  // Learn more about renaming an import declaration here:
  // https://www.codeshiftcommunity.com/docs/import-manipulation/#replacerename-an-import-declaration

  return root.toSource(options)
}
