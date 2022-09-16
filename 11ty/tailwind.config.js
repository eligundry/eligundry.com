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
    extend: {
      typography: ({ theme }) => ({
        gray: {
          css: {
            a: {
              color: theme("colors.primary"),
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
