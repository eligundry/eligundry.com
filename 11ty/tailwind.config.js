/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./**/*.{html,md,njk,liquid,js}", "!./_site", "!./node_modules"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  safelist: ["tooltip", "tooltip-open"],
  theme: {
    container: {
      screens: {
        xl: "786px",
        "2xl": "786px",
      },
    },
  },
};
