const EleventyFetch = require("@11ty/eleventy-fetch");
const dateFns = require("date-fns");

const MoodMapping = {
  awful: "😖",
  bad: "😣",
  meh: "😕",
  good: "😀",
  rad: "🥳",
};

module.exports = async function () {
  const endOfDateWindow = dateFns.subMonths(new Date(), 6);
  const feelings = await EleventyFetch(
    "https://api.eligundry.com/api/feelings",
    {
      duration: "1h",
      type: "json",
    }
  );

  return feelings
    .map((entry) => ({
      ...entry,
      emoji: MoodMapping[entry.mood],
      time: dateFns.parseISO(entry.time),
    }))
    .filter((entry) => entry.time >= endOfDateWindow);
};
