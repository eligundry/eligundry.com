import { averageColorFromURL } from './images'
import {
  getTopAlbums,
  type LastFMCoverItem,
  type LastFMPeriod,
} from './lastfmClient'

export type { LastFMCoverItem, LastFMPeriod, RecentTrack } from './lastfmClient'

const getTopAlbumsCover = async (
  username: string,
  period: LastFMPeriod = '7day'
): Promise<LastFMCoverItem[]> => {
  const albumsResp = await getTopAlbums(username, period)
  const topAlbums = await Promise.all(
    albumsResp
      .filter((album) => album.image.length > 0)
      .map(async (album): Promise<LastFMCoverItem> => {
        // image[2] is "large" (174px); image[3] is "extralarge" (300px).
        // Use extralarge so we have enough pixels for retina displays.
        const cover = album.image.at(3)?.url ?? album.image.at(2)?.url ?? ''
        const hires = album.image.at(3)?.url ?? ''
        const coverColor = cover ? await averageColorFromURL(cover) : null

        return {
          album: album.name,
          artist: album.artist.name,
          count: album.playcount,
          cover: cover,
          coverColor,
          hires,
          url: album.url,
        }
      })
  )

  return topAlbums
}

const api = { getTopAlbumsCover, getTopAlbums }

export default api
