/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./**/*.{html,md,njk,liquid}", "!./_site"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
