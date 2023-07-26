import LastFM from 'lastfm-typed'
import type {
  getRecentTracks,
  getTopAlbums,
} from 'lastfm-typed/dist/interfaces/userInterface'
import { cache } from './cache'
import { averageColorFromURL } from './images'

export type RecentTrack = getRecentTracks['tracks'][number]
export interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string
  coverColor: string | null
}
export type LastFMPeriods =
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
  period: LastFMPeriods = '7day'
) => {
  const c = await cache
  const cacheKey = `lastfm:getTopAlbums:${username}:${period}`
  let topAlbums = await c.get<getTopAlbums['albums']>(cacheKey)

  if (topAlbums) {
    return topAlbums
  }

  topAlbums = await lastfm.user
    .getTopAlbums(username, {
      period,
      limit: 15,
    })
    .then((resp) => resp.albums)

  if (!topAlbums) {
    throw new Error('Could not fetch top albums')
  }

  await c.set(cacheKey, topAlbums, 60 * 60)

  return topAlbums
}

const getTopAlbumsCover = async (
  username: string,
  period: LastFMPeriods = '7day'
): Promise<LastFMCoverItem[]> => {
  const c = await cache
  const cacheKey = `lastfm:getTopAlbumsCover:${username}:${period}`
  let topAlbums = await c.get<LastFMCoverItem[]>(cacheKey)

  if (topAlbums) {
    return topAlbums
  }

  const albumsResp = await getTopAlbums(username, period)

  topAlbums = await Promise.all(
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
        }
      })
  )

  c.set(cacheKey, topAlbums, 60 * 60)

  return topAlbums.slice(0, 9)
}

const getCollage = async (username: string, period: LastFMPeriods = '7day') => {
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
