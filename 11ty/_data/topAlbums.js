const { AssetCache } = require("@11ty/eleventy-fetch");
const Image = require("@11ty/eleventy-img");
const LastFM = require("lastfm-typed").default;

const lastfm = new LastFM(process.env.LAST_FM_API_KEY);

module.exports = async function () {
  const username = "eli_pwnd";
  const asset = new AssetCache(`${username}_top_lastfm_albums`);

  if (asset.isCacheValid("1h")) {
    return asset.getCachedValue();
  }

  const albumsResp = await lastfm.user.getTopAlbums(username, {
    limit: 15,
    period: "7day",
  });
  const topAlbums = await Promise.all(
    albumsResp.albums
      .filter((album) => album.image.length > 0)
      .map(async (album) => {
        const cover = await Image(album.image.at(-1).url, {
          widths: [300],
          urlPath: "/img/lastfm/",
          outputDir: "./_site/img/lastfm/",
          cacheOptions: {
            duration: "1y",
          },
        });

        return {
          name: album.name,
          artist: album.artist.name,
          count: album.playcount,
          cover,
        };
      })
      .slice(0, 9)
  );

  await asset.save(topAlbums, "json");

  return topAlbums;
};
