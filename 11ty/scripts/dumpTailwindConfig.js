const fs = require("fs");
const path = require("path");
const resolveConfig = require("tailwindcss/resolveConfig");
const pick = require("lodash/pick");
const tailwindConfig = require("../tailwind.config");

const p = path.join("./", "src", "_data", "tailwindTheme.json");
const fullConfig = resolveConfig(tailwindConfig);
fs.writeFileSync(
  p,
  JSON.stringify(
    pick(fullConfig.theme, ["colors", "screens", "fontFamily", "animation"]),
    undefined,
    2
  )
);
console.log(`Wrote tailwind theme to ${p}`);
