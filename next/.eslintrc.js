/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [
    'airbnb',
    'next',
    'next/core-web-vitals',
    'prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['public', 'static', '.cache', 'content', '*.d.ts'],
  rules: {
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/no-danger': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-use-before-define': 'off',
    'react/require-default-props': 'off',
    'no-param-reassign': 'off',
    radix: 'off',
    'no-plusplus': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight', 'to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function'],
      },
    ],
  },
  overrides: [
    {
      files: ['./lib/*'],
      rules: {
        'no-console': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
  settings: {
    'import/core-modules': [],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
  },
}
