const defaultTheme = require('tailwindcss/defaultTheme')
const pick = require('lodash/pick')

const emojiFonts = [
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
]

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{html,astro,md,mdx,ts,tsx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
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
      sans: ['Lato', '"Lato fallback"', 'sans-serif', ...emojiFonts],
      serif: ['Arvo', '"Arvo fallback"', 'serif', ...emojiFonts],
      mono: ['"Fira Code"', '"Fira Code fallback"', 'monospace', ...emojiFonts],
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
