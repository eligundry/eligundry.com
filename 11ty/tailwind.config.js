const defaultTheme = require("tailwindcss/defaultTheme");

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/**/*.{html,md,njk,js}", "./.eleventy.js"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  safelist: ["tooltip"],
  theme: {
    container: {
      screens: {
        xl: "786px",
        "2xl": "786px",
      },
    },
    screens: {
      ...defaultTheme.screens,
      print: {
        raw: "print",
      },
    },
    extend: {
      typography: ({ theme }) => ({
        gray: {
          css: {
            a: {
              color: theme("colors.primary"),
            },
            code: {
              padding: 0,
            },
          },
        },
      }),
    },
  },
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
  darkMode: ["class", "[data-theme='dark']"],
};
