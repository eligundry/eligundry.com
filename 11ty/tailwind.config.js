/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./*.{html,md,njk,liquid,js}",
    "./talks/*",
    "./blog/*",
    "./_includes/**/*",
    "./.eleventy.js",
  ],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  safelist: ["tooltip"],
  theme: {
    container: {
      screens: {
        xl: "786px",
        "2xl": "786px",
      },
    },
    extend: {
      typography: {
        gray: {
          css: {
            pre: {
              "background-color": "#181818",
              color: "#d8d8d8",
            },
          },
        },
      },
    },
  },
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
  darkMode: ["class", "[data-theme='dark']"],
};
