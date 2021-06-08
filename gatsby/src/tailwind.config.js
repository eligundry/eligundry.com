const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

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
  },
  variants: {},
  plugins: [],
}
