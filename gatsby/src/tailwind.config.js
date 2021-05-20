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
      sm: {
        min: '0px',
        max: '767px',
      },
    },
  },
  variants: {},
  plugins: [],
}
