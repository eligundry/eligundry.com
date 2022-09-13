const Image = require("@11ty/eleventy-img");

module.exports = async function () {
  // https://github.com/CatsJuice/ssr-contributions-img#themes
  const username = "eligundry";
  const params = new URLSearchParams({
    chart: "calendar",
    format: "svg",
    weeks: "50",
    theme: "blue",
  });
  const url = `https://ssr-contributions-svg.vercel.app/_/${username}?${params.toString()}`;
  console.log(url);
  return Image(url, {
    formats: ["svg"],
    urlPath: "/github-calendar/",
    outputDir: "./_site/github-calendar/",
    cacheOptions: {
      duration: "12h",
    },
  });
};
