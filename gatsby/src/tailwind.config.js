const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      white: 'white',
      // https://www.colourlovers.com/palette/1916178/Happy_Day_
      red: '#F45D4C',
      orange: '#F7A541',
      tangerine: '#FACA66',
      cream: '#FEE5AD',
      // green: '#A1DBB2',
      green: '#79BD9A',
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Open Sans', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
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
  plugins: [require('daisyui')],
}
