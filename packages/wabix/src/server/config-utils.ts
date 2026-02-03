let installed: boolean = false

export function loadWebpackHook() {
  if (installed) {
    return
  }
  installed = true

  // hook the Node.js require so that webpack requires are
  // routed to the bundled and now initialized webpack version
  ;(
    require('../server/require-hook') as typeof import('../server/require-hook')
  ).addHookAliases(
    [
      ['webpack', 'wabix/dist/compiled/webpack/webpack-lib'],
      ['webpack/package', 'wabix/dist/compiled/webpack/package'],
      ['webpack/package.json', 'wabix/dist/compiled/webpack/package'],
      ['webpack/lib/webpack', 'wabix/dist/compiled/webpack/webpack-lib'],
      ['webpack/lib/webpack.js', 'wabix/dist/compiled/webpack/webpack-lib'],
      [
        'webpack/lib/node/NodeEnvironmentPlugin',
        'wabix/dist/compiled/webpack/NodeEnvironmentPlugin',
      ],
      [
        'webpack/lib/node/NodeEnvironmentPlugin.js',
        'wabix/dist/compiled/webpack/NodeEnvironmentPlugin',
      ],
      [
        'webpack/lib/BasicEvaluatedExpression',
        'wabix/dist/compiled/webpack/BasicEvaluatedExpression',
      ],
      [
        'webpack/lib/BasicEvaluatedExpression.js',
        'wabix/dist/compiled/webpack/BasicEvaluatedExpression',
      ],
      [
        'webpack/lib/node/NodeTargetPlugin',
        'wabix/dist/compiled/webpack/NodeTargetPlugin',
      ],
      [
        'webpack/lib/node/NodeTargetPlugin.js',
        'wabix/dist/compiled/webpack/NodeTargetPlugin',
      ],
      [
        'webpack/lib/node/NodeTemplatePlugin',
        'wabix/dist/compiled/webpack/NodeTemplatePlugin',
      ],
      [
        'webpack/lib/node/NodeTemplatePlugin.js',
        'wabix/dist/compiled/webpack/NodeTemplatePlugin',
      ],
      [
        'webpack/lib/LibraryTemplatePlugin',
        'wabix/dist/compiled/webpack/LibraryTemplatePlugin',
      ],
      [
        'webpack/lib/LibraryTemplatePlugin.js',
        'wabix/dist/compiled/webpack/LibraryTemplatePlugin',
      ],
      [
        'webpack/lib/SingleEntryPlugin',
        'wabix/dist/compiled/webpack/SingleEntryPlugin',
      ],
      [
        'webpack/lib/SingleEntryPlugin.js',
        'wabix/dist/compiled/webpack/SingleEntryPlugin',
      ],
      [
        'webpack/lib/optimize/LimitChunkCountPlugin',
        'wabix/dist/compiled/webpack/LimitChunkCountPlugin',
      ],
      [
        'webpack/lib/optimize/LimitChunkCountPlugin.js',
        'wabix/dist/compiled/webpack/LimitChunkCountPlugin',
      ],
      [
        'webpack/lib/webworker/WebWorkerTemplatePlugin',
        'wabix/dist/compiled/webpack/WebWorkerTemplatePlugin',
      ],
      [
        'webpack/lib/webworker/WebWorkerTemplatePlugin.js',
        'wabix/dist/compiled/webpack/WebWorkerTemplatePlugin',
      ],
      [
        'webpack/lib/ExternalsPlugin',
        'wabix/dist/compiled/webpack/ExternalsPlugin',
      ],
      [
        'webpack/lib/ExternalsPlugin.js',
        'wabix/dist/compiled/webpack/ExternalsPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmTemplatePlugin',
        'wabix/dist/compiled/webpack/FetchCompileWasmTemplatePlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmTemplatePlugin.js',
        'wabix/dist/compiled/webpack/FetchCompileWasmTemplatePlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmPlugin',
        'wabix/dist/compiled/webpack/FetchCompileWasmPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmPlugin.js',
        'wabix/dist/compiled/webpack/FetchCompileWasmPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileAsyncWasmPlugin',
        'wabix/dist/compiled/webpack/FetchCompileAsyncWasmPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileAsyncWasmPlugin.js',
        'wabix/dist/compiled/webpack/FetchCompileAsyncWasmPlugin',
      ],
      [
        'webpack/lib/ModuleFilenameHelpers',
        'wabix/dist/compiled/webpack/ModuleFilenameHelpers',
      ],
      [
        'webpack/lib/ModuleFilenameHelpers.js',
        'wabix/dist/compiled/webpack/ModuleFilenameHelpers',
      ],
      ['webpack/lib/GraphHelpers', 'wabix/dist/compiled/webpack/GraphHelpers'],
      [
        'webpack/lib/GraphHelpers.js',
        'wabix/dist/compiled/webpack/GraphHelpers',
      ],
      ['webpack/lib/NormalModule', 'wabix/dist/compiled/webpack/NormalModule'],
      ['webpack-sources', 'wabix/dist/compiled/webpack/sources'],
      ['webpack-sources/lib', 'wabix/dist/compiled/webpack/sources'],
      ['webpack-sources/lib/index', 'wabix/dist/compiled/webpack/sources'],
      ['webpack-sources/lib/index.js', 'wabix/dist/compiled/webpack/sources'],
      ['@babel/runtime', 'wabix/dist/compiled/@babel/runtime/package.json'],
      [
        '@babel/runtime/package.json',
        'wabix/dist/compiled/@babel/runtime/package.json',
      ],
    ].map(
      // Use dynamic require.resolve to avoid statically analyzable since they're only for build time
      ([request, replacement]) => [request, require.resolve(replacement)]
    )
  )
}
