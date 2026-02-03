import type { Linter, Rule } from 'eslint'

import googleFontDisplay from './rules/google-font-display'
import googleFontPreconnect from './rules/google-font-preconnect'
import inlineScriptId from './rules/inline-script-id'
import nextScriptForGa from './rules/next-script-for-ga'
import noAssignModuleVariable from './rules/no-assign-module-variable'
import noAsyncClientComponent from './rules/no-async-client-component'
import noBeforeInteractiveScriptOutsideDocument from './rules/no-before-interactive-script-outside-document'
import noCssTags from './rules/no-css-tags'
import noDocumentImportInPage from './rules/no-document-import-in-page'
import noDuplicateHead from './rules/no-duplicate-head'
import noHeadElement from './rules/no-head-element'
import noHeadImportInDocument from './rules/no-head-import-in-document'
import noHtmlLinkForPages from './rules/no-html-link-for-pages'
import noImgElement from './rules/no-img-element'
import noPageCustomFont from './rules/no-page-custom-font'
import noScriptComponentInHead from './rules/no-script-component-in-head'
import noStyledJsxInDocument from './rules/no-styled-jsx-in-document'
import noSyncScripts from './rules/no-sync-scripts'
import noTitleInDocumentHead from './rules/no-title-in-document-head'
import noTypos from './rules/no-typos'
import noUnwantedPolyfillio from './rules/no-unwanted-polyfillio'

const recommendedRules = {
  // warnings
  '@wabix/next/google-font-display': 'warn',
  '@wabix/next/google-font-preconnect': 'warn',
  '@wabix/next/next-script-for-ga': 'warn',
  '@wabix/next/no-async-client-component': 'warn',
  '@wabix/next/no-before-interactive-script-outside-document': 'warn',
  '@wabix/next/no-css-tags': 'warn',
  '@wabix/next/no-head-element': 'warn',
  '@wabix/next/no-html-link-for-pages': 'warn',
  '@wabix/next/no-img-element': 'warn',
  '@wabix/next/no-page-custom-font': 'warn',
  '@wabix/next/no-styled-jsx-in-document': 'warn',
  '@wabix/next/no-sync-scripts': 'warn',
  '@wabix/next/no-title-in-document-head': 'warn',
  '@wabix/next/no-typos': 'warn',
  '@wabix/next/no-unwanted-polyfillio': 'warn',
  // errors
  '@wabix/next/inline-script-id': 'error',
  '@wabix/next/no-assign-module-variable': 'error',
  '@wabix/next/no-document-import-in-page': 'error',
  '@wabix/next/no-duplicate-head': 'error',
  '@wabix/next/no-head-import-in-document': 'error',
  '@wabix/next/no-script-component-in-head': 'error',
} satisfies Linter.RulesRecord

const coreWebVitalsRules = {
  '@wabix/next/no-html-link-for-pages': 'error',
  '@wabix/next/no-sync-scripts': 'error',
} satisfies Linter.RulesRecord

const plugin = {
  meta: {
    name: '@wabix/eslint-plugin-next',
  },
  rules: {
    'google-font-display': googleFontDisplay,
    'google-font-preconnect': googleFontPreconnect,
    'inline-script-id': inlineScriptId,
    'next-script-for-ga': nextScriptForGa,
    'no-assign-module-variable': noAssignModuleVariable,
    'no-async-client-component': noAsyncClientComponent,
    'no-before-interactive-script-outside-document':
      noBeforeInteractiveScriptOutsideDocument,
    'no-css-tags': noCssTags,
    'no-document-import-in-page': noDocumentImportInPage,
    'no-duplicate-head': noDuplicateHead,
    'no-head-element': noHeadElement,
    'no-head-import-in-document': noHeadImportInDocument,
    'no-html-link-for-pages': noHtmlLinkForPages,
    'no-img-element': noImgElement,
    'no-page-custom-font': noPageCustomFont,
    'no-script-component-in-head': noScriptComponentInHead,
    'no-styled-jsx-in-document': noStyledJsxInDocument,
    'no-sync-scripts': noSyncScripts,
    'no-title-in-document-head': noTitleInDocumentHead,
    'no-typos': noTypos,
    'no-unwanted-polyfillio': noUnwantedPolyfillio,
  } satisfies Record<string, Rule.RuleModule>,
  configs: {} as ESLintPluginConfigs,
}

type ESLintPluginConfigs = {
  'recommended-legacy': Linter.LegacyConfig
  'core-web-vitals-legacy': Linter.LegacyConfig
  recommended: Linter.Config
  'core-web-vitals': Linter.Config
}

Object.assign(plugin.configs, {
  'recommended-legacy': {
    plugins: ['@wabix/next'],
    rules: recommendedRules,
  },
  'core-web-vitals-legacy': {
    plugins: ['@wabix/next'],
    extends: ['plugin:@next/next/recommended-legacy'],
    rules: coreWebVitalsRules,
  },
  recommended: {
    name: 'wabix/recommended',
    plugins: {
      '@wabix/next': plugin,
    },
    rules: recommendedRules,
  },
  'core-web-vitals': {
    name: 'wabix/core-web-vitals',
    plugins: {
      '@wabix/next': plugin,
    },
    rules: {
      ...recommendedRules,
      ...coreWebVitalsRules,
    },
  },
} satisfies ESLintPluginConfigs)

export default plugin
export const { rules, configs } = plugin
