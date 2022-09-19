const Image = require("@11ty/eleventy-img");

module.exports = function (metadata, alt, sizes = "", lazy = true) {
  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: lazy ? "lazy" : "eager",
    decoding: lazy ? "async" : "auto",
  });
};
