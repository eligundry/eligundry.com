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
    logs: false,
    themes: [
      {
        light: {
          primary: '#088CDE',
          'primary-content': '#c7eaff',
          secondary: '#7dd3fc',
          'secondary-content': '#00334b',
          accent: '#98a0f2',
          'accent-content': '#00074f',
          neutral: '#f4f4f5',
          'neutral-content': '#303032',
          'base-100': 'white',
          'base-200': '#dedede',
          'base-300': '#bebebe',
          'base-content': '#161616',
          info: '#2563eb',
          'info-content': '#cfdeff',
          success: '#10b981',
          'success-content': '#00281b',
          warning: '#ffd53d',
          'warning-content': '#3f3200',
          error: '#F94E5F',
          'error-content': '#ffdade',
        },
      },
      {
        dark: {
          primary: '#088CDE',
          'primary-content': '#c7eaff',
          secondary: '#7dd3fc',
          'secondary-content': '#00334b',
          accent: '#98a0f2',
          'accent-content': '#00074f',
          neutral: '#78716c',
          'neutral-content': '#605a56',
          'base-100': '#1c1917',
          'base-200': '#191715',
          'base-300': '#171413',
          'base-content': '#d7d0cc',
          info: '#2563eb',
          'info-content': '#cfdeff',
          success: '#10b981',
          'success-content': '#00281b',
          warning: '#ffd53d',
          'warning-content': '#3f3200',
          error: '#F94E5F',
          'error-content': '#ffdade',
        },
      },
    ],
    darkTheme: 'dark',
  },
  darkMode: ['class', "[data-theme='dark']"],
}
