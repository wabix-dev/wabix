import path from 'path'
import * as React from 'react'
import {
  DOT_NEXT_ALIAS,
  PAGES_DIR_ALIAS,
  ROOT_DIR_ALIAS,
  APP_DIR_ALIAS,
  RSC_ACTION_PROXY_ALIAS,
  RSC_ACTION_CLIENT_WRAPPER_ALIAS,
  RSC_ACTION_VALIDATE_ALIAS,
  RSC_ACTION_ENCRYPTION_ALIAS,
  RSC_CACHE_WRAPPER_ALIAS,
  type WebpackLayerName,
  RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS,
} from '../lib/constants'
import type { NextConfigComplete } from '../server/config-shared'
import { defaultOverrides } from '../server/require-hook'
import { hasExternalOtelApiPackage } from './webpack-config'
import { NEXT_PROJECT_ROOT } from './next-dir-paths'
import { shouldUseReactServerCondition } from './utils'

interface CompilerAliases {
  [alias: string]: string | string[]
}

const isReact19 = typeof React.use === 'function'

export function createWebpackAliases({
  distDir,
  isClient,
  isEdgeServer,
  dev,
  config,
  pagesDir,
  appDir,
  dir,
  reactProductionProfiling,
}: {
  distDir: string
  isClient: boolean
  isEdgeServer: boolean
  dev: boolean
  config: NextConfigComplete
  pagesDir: string | undefined
  appDir: string | undefined
  dir: string
  reactProductionProfiling: boolean
}): CompilerAliases {
  const pageExtensions = config.pageExtensions
  const customAppAliases: CompilerAliases = {}
  const customDocumentAliases: CompilerAliases = {}

  // tell webpack where to look for _app and _document
  // using aliases to allow falling back to the default
  // version when removed or not present
  if (dev) {
    const nextDistPath = 'wabix/dist/' + (isEdgeServer ? 'esm/' : '')
    customAppAliases[`${PAGES_DIR_ALIAS}/_app`] = [
      ...(pagesDir
        ? pageExtensions.reduce((prev, ext) => {
            prev.push(path.join(pagesDir, `_app.${ext}`))
            return prev
          }, [] as string[])
        : []),
      `${nextDistPath}pages/_app.js`,
    ]
    customAppAliases[`${PAGES_DIR_ALIAS}/_error`] = [
      ...(pagesDir
        ? pageExtensions.reduce((prev, ext) => {
            prev.push(path.join(pagesDir, `_error.${ext}`))
            return prev
          }, [] as string[])
        : []),
      `${nextDistPath}pages/_error.js`,
    ]
    customDocumentAliases[`${PAGES_DIR_ALIAS}/_document`] = [
      ...(pagesDir
        ? pageExtensions.reduce((prev, ext) => {
            prev.push(path.join(pagesDir, `_document.${ext}`))
            return prev
          }, [] as string[])
        : []),
      `${nextDistPath}pages/_document.js`,
    ]
  }

  return {
    '@vercel/og$': 'wabix/dist/server/og/image-response',

    // Avoid bundling both entrypoints in React 19 when we just need one.
    // Also avoids bundler warnings in React 18 where react-dom/server.edge doesn't exist.
    'wabix/dist/server/ReactDOMServerPages': isReact19
      ? 'react-dom/server.edge'
      : 'react-dom/server.browser',

    // Alias next/dist imports to next/dist/esm assets,
    // let this alias hit before `next` alias.
    ...(isEdgeServer
      ? {
          'wabix/dist/api': 'wabix/dist/esm/api',
          'wabix/dist/build': 'wabix/dist/esm/build',
          'wabix/dist/client': 'wabix/dist/esm/client',
          'wabix/dist/shared': 'wabix/dist/esm/shared',
          'wabix/dist/pages': 'wabix/dist/esm/pages',
          'wabix/dist/lib': 'wabix/dist/esm/lib',
          'wabix/dist/server': 'wabix/dist/esm/server',

          ...createNextApiEsmAliases(),
        }
      : undefined),

    // For RSC server bundle
    ...(!hasExternalOtelApiPackage() && {
      '@opentelemetry/api': 'wabix/dist/compiled/@opentelemetry/api',
    }),

    ...(config.images.loaderFile
      ? {
          'wabix/dist/shared/lib/image-loader': config.images.loaderFile,
          ...(isEdgeServer && {
            'wabix/dist/esm/shared/lib/image-loader': config.images.loaderFile,
          }),
        }
      : undefined),

    'styled-jsx/style$': defaultOverrides['styled-jsx/style'],
    'styled-jsx$': defaultOverrides['styled-jsx'],

    'wabix/dist/compiled/next-devtools': isClient
      ? 'wabix/dist/compiled/next-devtools'
      : 'wabix/dist/next-devtools/dev-overlay.shim.js',

    ...customAppAliases,
    ...customDocumentAliases,

    ...(pagesDir ? { [PAGES_DIR_ALIAS]: pagesDir } : {}),
    ...(appDir ? { [APP_DIR_ALIAS]: appDir } : {}),
    [ROOT_DIR_ALIAS]: dir,
    ...(isClient
      ? {
          'private-next-instrumentation-client': [
            path.join(dir, 'src', 'instrumentation-client'),
            path.join(dir, 'instrumentation-client'),
            'private-next-empty-module',
          ],

          // disable typechecker, webpack5 allows aliases to be set to false to create a no-op module
          'private-next-empty-module': false as any,
        }
      : {}),

    [DOT_NEXT_ALIAS]: distDir,
    ...(isClient || isEdgeServer ? getOptimizedModuleAliases() : {}),
    ...(reactProductionProfiling ? getReactProfilingInProduction() : {}),

    [RSC_ACTION_VALIDATE_ALIAS]:
      'wabix/dist/build/webpack/loaders/next-flight-loader/action-validate',

    [RSC_ACTION_CLIENT_WRAPPER_ALIAS]:
      'wabix/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper',

    [RSC_ACTION_PROXY_ALIAS]:
      'wabix/dist/build/webpack/loaders/next-flight-loader/server-reference',

    [RSC_ACTION_ENCRYPTION_ALIAS]: 'wabix/dist/server/app-render/encryption',

    [RSC_CACHE_WRAPPER_ALIAS]:
      'wabix/dist/build/webpack/loaders/next-flight-loader/cache-wrapper',
    [RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS]:
      'wabix/dist/build/webpack/loaders/next-flight-loader/track-dynamic-import',

    '@swc/helpers/_': path.join(
      path.dirname(require.resolve('@swc/helpers/package.json')),
      '_'
    ),

    setimmediate: 'wabix/dist/compiled/setimmediate',
  }
}

export function createServerOnlyClientOnlyAliases(
  isServer: boolean
): CompilerAliases {
  return isServer
    ? {
        'server-only$': 'wabix/dist/compiled/server-only/empty',
        'client-only$': 'wabix/dist/compiled/client-only/error',
        'wabix/dist/compiled/server-only$':
          'wabix/dist/compiled/server-only/empty',
        'wabix/dist/compiled/client-only$':
          'wabix/dist/compiled/client-only/error',
      }
    : {
        'server-only$': 'wabix/dist/compiled/server-only/index',
        'client-only$': 'wabix/dist/compiled/client-only/index',
        'wabix/dist/compiled/client-only$':
          'wabix/dist/compiled/client-only/index',
        'wabix/dist/compiled/server-only':
          'wabix/dist/compiled/server-only/index',
      }
}

export function createNextApiEsmAliases() {
  const mapping = {
    head: 'wabix/dist/api/head',
    image: 'wabix/dist/api/image',
    constants: 'wabix/dist/api/constants',
    router: 'wabix/dist/api/router',
    dynamic: 'wabix/dist/api/dynamic',
    script: 'wabix/dist/api/script',
    link: 'wabix/dist/api/link',
    form: 'wabix/dist/api/form',
    navigation: 'wabix/dist/api/navigation',
    headers: 'wabix/dist/api/headers',
    og: 'wabix/dist/api/og',
    server: 'wabix/dist/api/server',
    // pages api
    document: 'wabix/dist/api/document',
    app: 'wabix/dist/api/app',
  }
  const aliasMap: Record<string, string> = {}
  // Handle fully specified imports like `next/image.js`
  for (const [key, value] of Object.entries(mapping)) {
    const nextApiFilePath = path.join(NEXT_PROJECT_ROOT, key)
    aliasMap[nextApiFilePath + '.js'] = value
  }

  return aliasMap
}

export function createAppRouterApiAliases(isServerOnlyLayer: boolean) {
  const mapping: Record<string, string> = {
    head: 'wabix/dist/client/components/noop-head',
    dynamic: 'wabix/dist/api/app-dynamic',
    link: 'wabix/dist/client/app-dir/link',
    form: 'wabix/dist/client/app-dir/form',
  }

  if (isServerOnlyLayer) {
    mapping['navigation'] = 'wabix/dist/api/navigation.react-server'
    mapping['link'] = 'wabix/dist/client/app-dir/link.react-server'
  }

  const aliasMap: Record<string, string> = {}
  for (const [key, value] of Object.entries(mapping)) {
    const nextApiFilePath = path.join(NEXT_PROJECT_ROOT, key)
    aliasMap[nextApiFilePath + '.js'] = value
  }
  return aliasMap
}

// file:///./../compiled/react/package.json
type ReactEntrypoint = 'jsx-runtime' | 'jsx-dev-runtime' | 'compiler-runtime'
// file:///./../compiled/react-dom/package.json
type ReactDOMEntrypoint =
  | 'client'
  | 'server'
  | 'server.edge'
  | 'server.browser'
  // TODO: server.node
  | 'static'
  | 'static.browser'
  | 'static.edge'
// TODO: static.node

// file:///./../compiled/react-server-dom-webpack/package.json
type ReactServerDOMWebpackEntrypoint =
  | 'client'
  // TODO: client.browser
  // TODO: client.edge
  // TODO: client.node
  | 'server'
  // TODO: server.browser
  // TODO: server.edge
  | 'server.node'
  | 'static'
// TODO: static.browser
// TODO: static.edge
// TODO: static.node

type ReactPackagesEntryPoint =
  | 'react'
  | `react/${ReactEntrypoint}`
  | 'react-dom'
  | `react-dom/${ReactDOMEntrypoint}`
  | `react-server-dom-webpack/${ReactServerDOMWebpackEntrypoint}`

type BundledReactChannel = '' | '-experimental'

type ReactAliases = {
  [K in `${ReactPackagesEntryPoint}$`]: string
} & {
  // Edge Runtime does not use next-server runtime.
  // This means we rely on rewritten import sources in compiled React.
  // We need to alias those rewritten import sources.
  [K in
    | `next/dist/compiled/react${BundledReactChannel}$`
    | `next/dist/compiled/react${BundledReactChannel}/${ReactEntrypoint}$`
    | `next/dist/compiled/react-dom${BundledReactChannel}$`]?: string
}

export function createVendoredReactAliases(
  bundledReactChannel: BundledReactChannel,
  {
    layer,
    isBrowser,
    isEdgeServer,
    reactProductionProfiling,
  }: {
    layer: WebpackLayerName
    isBrowser: boolean
    isEdgeServer: boolean
    reactProductionProfiling: boolean
  }
): CompilerAliases {
  const environmentCondition = isBrowser
    ? 'browser'
    : isEdgeServer
      ? 'edge'
      : 'nodejs'
  const reactCondition = shouldUseReactServerCondition(layer)
    ? 'server'
    : 'client'

  // ✅ Correct alias
  // ❌ Incorrect alias i.e. importing this entrypoint should throw an error.
  // ❔ Alias that may produce correct code in certain conditions.Keep until react-markup is available.

  let reactAlias: ReactAliases
  if (environmentCondition === 'browser' && reactCondition === 'client') {
    // prettier-ignore
    reactAlias = {
      // file:///./../compiled/react/package.json
      react$:                                  /* ✅ */ `next/dist/compiled/react${bundledReactChannel}`,
      'react/compiler-runtime$':               /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/compiler-runtime`,
      'react/jsx-dev-runtime$':                /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/jsx-dev-runtime`,
      'react/jsx-runtime$':                    /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/jsx-runtime`,
      // file:///./../compiled/react-dom/package.json
      'react-dom$':                            /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}`,
      'react-dom/client$':                     /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/client`,
      'react-dom/server$':                     /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      'react-dom/server.browser$':             /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      // optimizations to ignore the legacy build of react-dom/server in `server.edge` build
      'react-dom/server.edge$':                /* ❌ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/static$':                     /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.browser$':             /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.edge$':                /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      // file:///./../compiled/react-server-dom-webpack/package.json
      'react-server-dom-webpack/client$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/client.browser`,
      'react-server-dom-webpack/server$':      /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.browser`,
      'react-server-dom-webpack/server.node$': /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.node`,
      'react-server-dom-webpack/static$':      /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/static.browser`,
    }
  } else if (
    environmentCondition === 'browser' &&
    reactCondition === 'server'
  ) {
    // prettier-ignore
    reactAlias = {
      // file:///./../compiled/react/package.json
      react$:                                  /* ❌ */ `next/dist/compiled/react${bundledReactChannel}`,
      'react/compiler-runtime$':               /* ❌ */ `next/dist/compiled/react${bundledReactChannel}/compiler-runtime`,
      'react/jsx-dev-runtime$':                /* ❌ */ `next/dist/compiled/react${bundledReactChannel}/jsx-dev-runtime`,
      'react/jsx-runtime$':                    /* ❌ */ `next/dist/compiled/react${bundledReactChannel}/jsx-runtime`,
      // file:///./../compiled/react-dom/package.json
      'react-dom$':                            /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}`,
      'react-dom/client$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/client`,
      'react-dom/server$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      'react-dom/server.browser$':             /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      // optimizations to ignore the legacy build of react-dom/server in `server.edge` build
      'react-dom/server.edge$':                /* ❌ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/static$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.browser$':             /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.edge$':                /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      // file:///./../compiled/react-server-dom-webpack/package.json
      'react-server-dom-webpack/client$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/client.browser`,
      'react-server-dom-webpack/server$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.browser`,
      'react-server-dom-webpack/server.node$': /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.node`,
      'react-server-dom-webpack/static$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/static.browser`,
    }
  } else if (environmentCondition === 'nodejs' && reactCondition === 'client') {
    // prettier-ignore
    reactAlias = {
      // file:///./../compiled/react/package.json
      react$:                                 /* ✅ */ `next/dist/server/route-modules/app-page/vendored/ssr/react`,
      'react/compiler-runtime$':              /* ✅ */ `next/dist/server/route-modules/app-page/vendored/ssr/react-compiler-runtime`,
      'react/jsx-dev-runtime$':               /* ✅ */ `next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime`,
      'react/jsx-runtime$':                   /* ✅ */ `next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime`,
      // file:///./../compiled/react-dom/package.json
      'react-dom$':                           /* ✅ */ `next/dist/server/route-modules/app-page/vendored/ssr/react-dom`,
      'react-dom/client$':                    /* ❔ */ `next/dist/compiled/react-dom${bundledReactChannel}/client`,
      'react-dom/server$':                    /* ❔ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.node`,
      'react-dom/server.browser$':            /* ❔ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      // optimizations to ignore the legacy build of react-dom/server in `server.edge` build
      'react-dom/server.edge$':               /* ✅ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/static$':                    /* ❔ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.node`,
      'react-dom/static.browser$':            /* ❔ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.edge$':               /* ❔ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      // file:///./../compiled/react-server-dom-webpack/package.json
      'react-server-dom-webpack/client$':     /* ✅ */ `next/dist/server/route-modules/app-page/vendored/ssr/react-server-dom-webpack-client`,
      'react-server-dom-webpack/server$':     /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.node`,
      'react-server-dom-webpack/server.node$':/* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.node`,
      'react-server-dom-webpack/static$':     /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/static.node`,
    }
  } else if (environmentCondition === 'nodejs' && reactCondition === 'server') {
    // prettier-ignore
    reactAlias = {
      // file:///./../compiled/react/package.json
      react$:                                  /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react`,
      'react/compiler-runtime$':               /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-compiler-runtime`,
      'react/jsx-dev-runtime$':                /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime`,
      'react/jsx-runtime$':                    /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime`,
      // file:///./../compiled/react-dom/package.json
      'react-dom$':                            /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-dom`,
      'react-dom/client$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/client`,
      'react-dom/server$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.node`,
      'react-dom/server.browser$':             /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      // optimizations to ignore the legacy build of react-dom/server in `server.edge` build
      'react-dom/server.edge$':                /* ❌ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/static$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.node`,
      'react-dom/static.browser$':             /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.edge$':                /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      // file:///./../compiled/react-server-dom-webpack/package.json
      'react-server-dom-webpack/client$':      /* ❔ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/client.node`,
      'react-server-dom-webpack/server$':      /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-webpack-server`,
      'react-server-dom-webpack/server.node$': /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-webpack-server`,
      'react-server-dom-webpack/static$':      /* ✅ */ `next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-webpack-static`,
    }
  } else if (environmentCondition === 'edge' && reactCondition === 'client') {
    // prettier-ignore
    reactAlias = {
      // file:///./../compiled/react/package.json
      react$:                                  /* ✅ */ `next/dist/compiled/react${bundledReactChannel}`,
      'react/compiler-runtime$':               /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/compiler-runtime`,
      'react/jsx-dev-runtime$':                /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/jsx-dev-runtime`,
      'react/jsx-runtime$':                    /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/jsx-runtime`,
      // file:///./../compiled/react-dom/package.json
      'react-dom$':                            /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}`,
      'react-dom/client$':                     /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/client`,
      'react-dom/server$':                     /* ✅ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/server.browser$':             /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      // optimizations to ignore the legacy build of react-dom/server in `server.edge` build
      'react-dom/server.edge$':                /* ✅ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/static$':                     /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      'react-dom/static.browser$':             /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.edge$':                /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      // file:///./../compiled/react-server-dom-webpack/package.json
      'react-server-dom-webpack/client$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/client.edge`,
      'react-server-dom-webpack/server$':      /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.edge`,
      'react-server-dom-webpack/server.node$': /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.node`,
      'react-server-dom-webpack/static$':      /* ❌ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/static.edge`,
    }
  } else if (environmentCondition === 'edge' && reactCondition === 'server') {
    // prettier-ignore
    reactAlias = {
      // file:///./../compiled/react/package.json
      react$:                                  /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/react.react-server`,
      'react/compiler-runtime$':               /* ❌ */ `next/dist/compiled/react${bundledReactChannel}/compiler-runtime`,
      'react/jsx-dev-runtime$':                /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/jsx-dev-runtime.react-server`,
      'react/jsx-runtime$':                    /* ✅ */ `next/dist/compiled/react${bundledReactChannel}/jsx-runtime.react-server`,
      // file:///./../compiled/react-dom/package.json
      'react-dom$':                            /* ✅ */ `next/dist/compiled/react-dom${bundledReactChannel}/react-dom.react-server`,
      'react-dom/client$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/client`,
      'react-dom/server$':                     /* ❌ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/server.browser$':             /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/server.browser`,
      // optimizations to ignore the legacy build of react-dom/server in `server.edge` build
      'react-dom/server.edge$':                /* ❌ */ `next/dist/build/webpack/alias/react-dom-server${bundledReactChannel}.js`,
      'react-dom/static$':                     /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      'react-dom/static.browser$':             /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.browser`,
      'react-dom/static.edge$':                /* ❌ */ `next/dist/compiled/react-dom${bundledReactChannel}/static.edge`,
      // file:///./../compiled/react-server-dom-webpack/package.json
      'react-server-dom-webpack/client$':      /* ❔ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/client.edge`,
      'react-server-dom-webpack/server$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.edge`,
      'react-server-dom-webpack/server.node$': /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/server.node`,
      'react-server-dom-webpack/static$':      /* ✅ */ `next/dist/compiled/react-server-dom-webpack${bundledReactChannel}/static.edge`,
    }

    // prettier-ignore
    reactAlias[`next/dist/compiled/react${bundledReactChannel}$`                 ] = reactAlias[`react$`]
    // prettier-ignore
    reactAlias[`next/dist/compiled/react${bundledReactChannel}/compiler-runtime$`] = reactAlias[`react/compiler-runtime$`]
    // prettier-ignore
    reactAlias[`next/dist/compiled/react${bundledReactChannel}/jsx-dev-runtime$` ] = reactAlias[`react/jsx-dev-runtime$`]
    // prettier-ignore
    reactAlias[`next/dist/compiled/react${bundledReactChannel}/jsx-runtime$`     ] = reactAlias[`react/jsx-runtime$`]
    // prettier-ignore
    reactAlias[`next/dist/compiled/react-dom${bundledReactChannel}$`             ] = reactAlias[`react-dom$`]
  } else {
    throw new Error(
      `Unsupported environment condition "${environmentCondition}" and react condition "${reactCondition}". This is a bug in Next.js.`
    )
  }

  if (reactProductionProfiling) {
    reactAlias['react-dom/client$'] =
      `next/dist/compiled/react-dom${bundledReactChannel}/profiling`
  }

  const alias: CompilerAliases = reactAlias

  alias[
    '@vercel/turbopack-ecmascript-runtime/browser/dev/hmr-client/hmr-client.ts'
  ] = `next/dist/client/dev/noop-turbopack-hmr`

  return alias
}

// Insert aliases for Next.js stubs of fetch, object-assign, and url
// Keep in sync with insert_optimized_module_aliases in import_map.rs
export function getOptimizedModuleAliases(): CompilerAliases {
  return {
    unfetch: require.resolve('wabix/dist/build/polyfills/fetch/index.js'),
    'isomorphic-unfetch': require.resolve(
      'wabix/dist/build/polyfills/fetch/index.js'
    ),
    'whatwg-fetch': require.resolve(
      'wabix/dist/build/polyfills/fetch/whatwg-fetch.js'
    ),
    'object-assign': require.resolve(
      'wabix/dist/build/polyfills/object-assign.js'
    ),
    'object.assign/auto': require.resolve(
      'wabix/dist/build/polyfills/object.assign/auto.js'
    ),
    'object.assign/implementation': require.resolve(
      'wabix/dist/build/polyfills/object.assign/implementation.js'
    ),
    'object.assign/polyfill': require.resolve(
      'wabix/dist/build/polyfills/object.assign/polyfill.js'
    ),
    'object.assign/shim': require.resolve(
      'wabix/dist/build/polyfills/object.assign/shim.js'
    ),
    url: require.resolve('wabix/dist/compiled/native-url'),
  }
}

function getReactProfilingInProduction(): CompilerAliases {
  return {
    'react-dom/client$': 'react-dom/profiling',
  }
}
