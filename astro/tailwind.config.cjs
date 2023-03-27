const defaultTheme = require('tailwindcss/defaultTheme')
const pick = require('lodash/pick')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{html,astro,md,mdx}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('@tailwindcss/line-clamp'),
  ],
  safelist: ['tooltip', 'tooltip-primary'],
  theme: {
    colors: pick(defaultTheme.colors, ['white', 'transparent']),
    container: {
      screens: {
        xl: '786px',
        '2xl': '786px',
      },
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
      serif: ['Arvo', 'serif'],
      mono: ['"Fira Code"', 'monospace'],
    },
    screens: {
      ...defaultTheme.screens,
      print: {
        raw: 'print',
      },
    },
    extend: {
      typography: ({ theme }) => ({
        gray: {
          css: {
            a: {
              color: theme('colors.primary'),
            },
            code: {
              padding: 0,
            },
          },
        },
      }),
      lineClamp: {
        10: '10',
      },
      keyframes: {
        fadein: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        fadein: 'fadein 10s',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: '#088CDE',
          secondary: '#7dd3fc',
          accent: '#98a0f2',
          neutral: '#f4f4f5',
          'base-100': 'white',
          info: '#2563eb',
          success: '#10b981',
          warning: '#ffd53d',
          error: '#F94E5F',
        },
      },
      {
        dark: {
          primary: '#088CDE',
          secondary: '#7dd3fc',
          accent: '#98a0f2',
          neutral: '#78716c',
          'base-100': '#1c1917',
          info: '#2563eb',
          success: '#10b981',
          warning: '#fbbf24',
          error: '#F94E5F',
        },
      },
    ],
    darkTheme: 'dark',
  },
  darkMode: ['class', "[data-theme='dark']"],
}
