const path = require("path");
const EleventyFetch = require("@11ty/eleventy-fetch");
const kebabCase = require("lodash/kebabCase");

const fence = "```";

module.exports = async function githubFileEmbed(
  url,
  linesToShowInPreview = 10
) {
  const parsedURL = new URL(url);
  parsedURL.host = `raw.githubusercontent.com`;

  const [user, repo, _blob, ref, ...filePath] = parsedURL.pathname
    .split("/")
    .filter(Boolean);

  if (ref === "master" || ref === "main") {
    throw new Error(`Use a commit hash for githubFileEmbed "${url}"`);
  }

  parsedURL.pathname = [user, repo, ref, ...filePath].join("/");

  let range = null;

  if (parsedURL.hash) {
    try {
      const matches = parsedURL.hash.matchAll(/#L(\d+)-L(\d+)/g);
      const items = Array.from(...matches);

      if (items.length) {
        range = items
          .slice(1)
          .map((n, i) => (i === 0 ? parseInt(n) - 1 : parseInt(n)));
      }
    } catch (e) {}
  }

  const extension = path.extname(filePath.at(-1)).slice(1);

  let file = await EleventyFetch(parsedURL.toString(), {
    type: "text",
    duration: "1y",
  });

  const fileLength = file.split(/\r?\n/).length;

  if (fileLength <= linesToShowInPreview) {
    return `
${fence}${extension}
${file}
${fence}
    `;
  }

  if (range) {
    file = file
      .split(/\r?\n/)
      .slice(...range)
      .join("\n");
  }

  const id = kebabCase(url);

  const element = `
<div class="collapse [&>.peer:checked]:input-disabled [&>*]:max-w-full [&>*]:overflow-auto">
  <input type="checkbox" class="peer [&:checked~label]:hidden [&:checked+.collapse-title]:!cursor-auto" id="${id}" data-gtm="emgithub-file-expanded" data-gtm-emgithub-file-url="${url}" />
  <div class="collapse-title mb-0 p-0 [&>pre]:mb-0 [&>pre]:overflow-auto [&>pre]:max-w-full [&>pre]:rounded-b-none">

${fence}${extension}
${file.split("\n").slice(0, linesToShowInPreview).join("\n")}
${fence}

  </div>
  <div class="collapse-content [&>pre]:mt-0 [&>pre]:pt-0 px-0 mb-0 [&>pre]:rounded-t-none [&>pre]:overflow-auto [&>pre]:max-w-full">

${fence}${extension}
${file.split("\n").slice(linesToShowInPreview).join("\n")}
${fence}

  </div>
  <label for="${id}" class="btn btn-primary mb-4 rounded-t-none">Click to expand</label>
</div>
  `;

  return element;
};
