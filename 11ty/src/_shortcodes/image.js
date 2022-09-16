const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(src, alt, sizes = "") {
  let imgSrc = src;
  let outputDir = path.join("_site", "img");
  let urlPath = "/img/";

  if (!imgSrc.startsWith("http")) {
    imgSrc = path.join(path.dirname(this.page.inputPath), imgSrc);
    outputDir = path.join("_site", path.dirname(imgSrc));
    urlPath = `/${path.dirname(imgSrc)}`;
  }

  let metadata = await Image(imgSrc, {
    widths: [690],
    outputDir,
    urlPath,
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
};
