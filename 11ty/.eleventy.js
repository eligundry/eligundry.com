const dateFns = require("date-fns");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode(
    "emojiText",
    (emoji, label, text) =>
      `<span role="img" aria-label="${label}">${emoji}</span> ${text}`
  );

  eleventyConfig.addShortcode("currentYear", () =>
    new Date().getFullYear().toString()
  );

  eleventyConfig.addShortcode("resumeSkillList", (skills) => {
    const formatter = new Intl.ListFormat("en", {
      style: "long",
      type: "conjunction",
    });
    const skillsLinks = Object.entries(skills).map(
      ([name, url]) => `<a href="${url}" itemprop="knowsAbout">${name}</a>`
    );

    return formatter.format(skillsLinks);
  });

  eleventyConfig.addShortcode("formatDate", (date, format) => {
    switch (format) {
      case "iso8601-date":
        return dateFns.formatISO(date, { representation: "date" });
      case "month-year":
        return dateFns.format(date, "MMMM yyyy");
    }
  });
};
