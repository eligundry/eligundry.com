/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './hooks/**/*.{js,ts,jsx,tsx}',
      './utils/**/*.{js,ts,jsx,tsx}',
    ],
  },
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      primaryLite: '#92c6e7',
      primaryMedium: '#4a93c2',
      primary: '#088CDE',
      primaryDark: '#4E7A94',
      typography: '#27272a',
      typographyLite: '#52525b',
      typographyDark: '#18181b',
      siteBackground: '#f4f4f5',
      white: '#fff',
      black: '#000',
      liteGray: '#E5E7EB',
      paper: 'rgba(244, 244, 245, 0.95)',
      paperDark: 'rgba(0, 0, 0, 0.85)',
      yellow: '#ffd53d',
      red: '#f25c54',
      green: '#48cb8a',
    },
    screens: {
      ...defaultTheme.screens,
      xs: {
        min: '0px',
        max: '767px',
      },
      sm: {
        min: '0px',
        max: '767px',
      },
      print: {
        raw: 'print',
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      serif: ['Zilla Slab', 'Georgia', 'serif'],
      sans: ['Fira Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
      // These are fallback fonts to make my resume smol and parseable by ATSs
      parseSafeSans: ['Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      parseSafeSerif: ['Georgia', 'serif'],
      parseSafeMono: ['monospace'],
    },
  },
  variants: {},
  plugins: [],
}
