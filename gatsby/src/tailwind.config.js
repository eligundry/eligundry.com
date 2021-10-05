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
      serif: ['Georgia', 'serif'],
    },
  },
  variants: {},
  plugins: [],
}
