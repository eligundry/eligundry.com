const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      primary: '#088CDE',
      primaryLite: '#92c6e7',
      primaryDark: '#4E7A94',
      typography: '#27272a',
      typographyLite: '#52525b',
      typographyDark: '#18181b',
      siteBackground: '#f4f4f5',
      white: '#fff',
      black: '#000',
      liteGray: '#E5E7EB',
      paper: 'rgba(244, 244, 245, 0.95)',
      paperDark: 'rgba(0, 0, 0, 0.75)',
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
      serif: ['Source Serif Pro', 'Georgia', 'serif'],
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
