const Image = require("@11ty/eleventy-img");

module.exports = function (metadata, alt, sizes = "") {
  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  });
};
