import parser from 'astro-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import * as mdx from 'eslint-plugin-mdx'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  eslintPluginPrettierRecommended,
  {
    ...mdx.flat,
    // optional, if you want to lint code blocks at the same
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
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
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['src/components/FancyBackground/worklet.js'],
  },
  {
    files: ['**/*.astro'],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {},
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
