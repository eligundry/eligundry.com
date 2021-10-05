const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      primary: '#088CDE',
      primaryLite: '#92c6e7',
      primaryDark: '#4E7A94',
      secondary: '#D67A27',
      typography: '#27272a',
      typographyLite: '#52525b',
      typographyDark: '#18181b',
      siteBackground: '#f4f4f5',
    },
    screens: {
      ...defaultTheme.screens,
      xs: {
        min: '0px',
        max: '375px',
      },
      sm: {
        min: '376px',
        max: '767px',
      },
      print: {
        raw: 'print',
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      // serif: ['Georgia', 'serif'],
    },
  },
  variants: {},
  plugins: [],
}
