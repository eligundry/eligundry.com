const Image = require("@11ty/eleventy-img");
const dateFns = require("date-fns");

require("dotenv").config();

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["avif", "jpeg"],
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

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
      case "iso8601":
        return dateFns.formatISO(date);
      case "month-year":
        return dateFns.format(date, "MMMM yyyy");
    }
  });

  eleventyConfig.addShortcode("feelingsActivityList", (activities) => {
    const ActivityMap = {
      cook: "🧑‍🍳",
      movies: "🍿",
      movie: "🍿",
      relax: "💆‍♂️",
      "side-project": "👨‍💻",
      work: "💼",
      friends: "👯‍♂️",
      sport: "🏃‍♂️",
      date: "👫",
      WFH: "🏚",
      reading: "📚",
      shopping: "🛒",
      "good meal": "🍜",
      museum: "🏛",
      party: "🎉",
      cleaning: "🧹",
      gaming: "🕹",
      "binging tv": "📺",
      "ate meat": "🥩",
      "no meat": "🌿",
      travel: "✈️",
      "went outside": "🌞",
      delivery: "🥡",
      concert: "🎶",
      "Broadway show": "🎭",
      guitar: "🎸",
    };

    return `
      <ul class="pl-0 not-prose">
        ${activities
          .map(
            (a) =>
              `<li role="img" aria-label="${a}" data-tip="${a}" class="tooltip" itemprop="keywords">
                ${ActivityMap[a]}
              </li>`
          )
          .join("\n")}
      </ul>
    `;
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addShortcode(
    "cachedToolTipImage",
    (metadata, alt, sizes = "") => {
      const lowsrc = metadata.jpeg[0];
      const sources = Object.values(metadata)
        .map((imageFormat) => {
          return `<source type="${
            imageFormat[0].sourceType
          }" srcset="${imageFormat
            .map((entry) => entry.srcset)
            .join(", ")}" sizes="${sizes}">`;
        })
        .join("\n");

      return `
      <picture class="tooltip" data-tip="${alt}">
        ${sources}
        <img
          src="${lowsrc.url}"
          width="${lowsrc.width}"
          height="${lowsrc.height}"
          alt="${alt}"
          loading="lazy"
          decoding="async">
      </picture>
    `;
    }
  );
};
