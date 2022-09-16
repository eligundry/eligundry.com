module.exports = function bandcampAlbum({
  name,
  artist,
  url,
  bandcampID,
  classes = "",
}) {
  return `
<iframe loading="lazy" src="https://bandcamp.com/EmbeddedPlayer/album=${bandcampID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" class="${classes}" style="width: 320px; height: 470px;" title="album embed from bandcamp.com">
  <a href="${url}">
    ${name} by ${artist}
  </a>
</iframe>
  `;
};
