module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode(
    "emojiText",
    (emoji, label, text) =>
      `<span role="img" aria-label="${label}">${emoji}</span> ${text}`
  );

  eleventyConfig.addShortcode("currentYear", () =>
    new Date().getFullYear().toString()
  );
};
