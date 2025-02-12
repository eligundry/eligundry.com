import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import * as mdx from 'eslint-plugin-mdx'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  eslintPluginPrettierRecommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ...mdx.flat,
    // optional, if you want to lint code blocks at the same
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
      // optional, if you want to disable language mapper, set it to `false`
      // if you want to override the default language mapper inside, you can provide your own
      languageMapper: {},
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      // if you want to override some rules for code blocks
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['src/components/FancyBackground/worklet.js'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
    },
    rules: {},
  },
  {
    files: ['**/*.mdx'],
    rules: {
      'null-null': 'off',
    },
  },
]
