module.exports = function (metadata, alt, sizes = "") {
  const lowsrc = metadata.jpeg[0];
  const sources = Object.values(metadata)
    .map((imageFormat) => {
      return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
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
};
