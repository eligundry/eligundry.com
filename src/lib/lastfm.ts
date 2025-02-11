import LastFM from 'lastfm-typed'
import type {
  getRecentTracks,
  getTopAlbums,
} from 'lastfm-typed/dist/interfaces/userInterface'
import { averageColorFromURL } from './images'

export type RecentTrack = getRecentTracks['tracks'][number]
export interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string
  coverColor: string | null
  url: string
}
export type LastFMPeriod =
  | 'overall'
  | '7day'
  | '1month'
  | '3month'
  | '6month'
  | '12month'

if (!import.meta.env.LAST_FM_API_KEY) {
  throw new Error('LAST_FM_API_KEY must be defined for the site to run')
}

try {
  // @ts-ignore
  var lastfm = new LastFM.default(import.meta.env.LAST_FM_API_KEY) as LastFM
} catch (e) {
  var lastfm = new LastFM(import.meta.env.LAST_FM_API_KEY)
}

const getTopAlbums = async (
  username: string,
  period: LastFMPeriod = '7day'
) => {
  const topAlbums = await lastfm.user
    .getTopAlbums(username, {
      period,
      limit: 15,
    })
    .then((resp) => resp.albums)

  if (!topAlbums) {
    throw new Error('Could not fetch top albums')
  }

  return topAlbums
}

const getTopAlbumsCover = async (
  username: string,
  period: LastFMPeriod = '7day'
): Promise<LastFMCoverItem[]> => {
  const albumsResp = await getTopAlbums(username, period)
  const topAlbums = await Promise.all(
    albumsResp
      .filter((album) => album.image.length > 0)
      .map(async (album): Promise<LastFMCoverItem> => {
        const cover = album.image.at(2)?.url ?? ''
        const coverColor = cover ? await averageColorFromURL(cover) : null

        return {
          album: album.name,
          artist: album.artist.name,
          count: album.playcount,
          cover: cover,
          coverColor,
          url: album.url,
        }
      })
  )

  return topAlbums
}

const getCollage = async (username: string, period: LastFMPeriod = '7day') => {
  const url = new URL('https://tapmusic.net/collage.php')
  url.searchParams.set('user', username)
  url.searchParams.set('type', period)
  url.searchParams.set('size', '3x3')

  return fetch(url.toString())
    .then((resp) => resp.arrayBuffer())
    .then((buffer) => Buffer.from(buffer, 'binary'))
}

const api = { getTopAlbumsCover, getTopAlbums, getCollage }

export default api
