const EleventyFetch = require("@11ty/eleventy-fetch");

const MoodMapping = {
  awful: "😖",
  bad: "😣",
  meh: "😕",
  good: "😀",
  rad: "🥳",
};

module.exports = async function () {
  const feelings = await EleventyFetch(
    "https://api.eligundry.com/api/feelings",
    {
      duration: "1h",
      type: "json",
    }
  );

  return feelings.map((entry) => ({
    ...entry,
    emoji: MoodMapping[entry.mood],
  }));
};
