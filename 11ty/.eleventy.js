const shortcodes = require("./src/_shortcodes");
require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));
  eleventyConfig.addPassthroughCopy("src/components");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@11ty/is-land/is-land.js": "js/is-land.js",
  });

  eleventyConfig.addShortcode("emojiText", shortcodes.emojiText);
  eleventyConfig.addShortcode("resumeSkillList", shortcodes.resumeSkillList);
  eleventyConfig.addShortcode("formatDate", shortcodes.formatDate);
  eleventyConfig.addShortcode(
    "feelingsActivityList",
    shortcodes.feelingsActivityList
  );
  eleventyConfig.addNunjucksAsyncShortcode("image", shortcodes.image);
  eleventyConfig.addShortcode("cachedImage", shortcodes.cachedImage);
  eleventyConfig.addShortcode(
    "cachedToolTipImage",
    shortcodes.cachedToolTipImage
  );
  eleventyConfig.addShortcode("googleSlideShow", shortcodes.googleSlideShow);
  eleventyConfig.addNunjucksAsyncShortcode(
    "githubFileEmbed",
    shortcodes.githubFileEmbed
  );
  eleventyConfig.addNunjucksShortcode(
    "bandcampAlbum",
    shortcodes.bandcampAlbum
  );
  eleventyConfig.addNunjucksShortcode("youtube", shortcodes.youtube);

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addShortcode("currentYear", () =>
    new Date().getFullYear().toString()
  );

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
