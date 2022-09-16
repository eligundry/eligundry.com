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

module.exports = function (activities) {
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
};
