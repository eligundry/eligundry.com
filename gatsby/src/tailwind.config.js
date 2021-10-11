const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
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
      liteGray: '#E5E7EB',
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
    },
  },
  variants: {},
  plugins: [],
}
