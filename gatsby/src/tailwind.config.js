const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      // https://www.colourlovers.com/palette/1916178/Happy_Day_
      red: '#F45D4C',
      orange: '#F7A541',
      tangerine: '#FACA66',
      cream: '#FEE5AD',
      green: '#A1DBB2',
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
