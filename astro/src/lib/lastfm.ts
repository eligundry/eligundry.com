import LastFM from 'lastfm-typed'
import type { getRecentTracks } from 'lastfm-typed/dist/interfaces/userInterface'
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

if (!import.meta.env.LAST_FM_API_KEY) {
  throw new Error('LAST_FM_API_KEY must be defined for the site to run')
}

try {
  // @ts-ignore
  var lastfm = new LastFM.default(import.meta.env.LAST_FM_API_KEY) as LastFM
} catch (e) {
  var lastfm = new LastFM(import.meta.env.LAST_FM_API_KEY)
}
const getTopAlbumsCover = async (
  username: string
): Promise<LastFMCoverItem[]> => {
  const c = await cache
  let topAlbums = await c.get<LastFMCoverItem[]>('lastfm-cover')

  if (topAlbums) {
    return topAlbums
  }

  const albumsResp = await lastfm.user.getTopAlbums(username, {
    limit: 15,
    period: '7day',
  })
  topAlbums = await Promise.all(
    albumsResp.albums
      .filter((album) => album.image.length > 0)
      .map(async (album): Promise<LastFMCoverItem> => {
        const cover = album.image.at(-1)?.url ?? ''
        const coverColor = cover ? await averageColorFromURL(cover) : null

        return {
          album: album.name,
          artist: album.artist.name,
          count: album.playcount,
          cover,
          coverColor,
        }
      })
  )

  c.set('lastfm-cover', topAlbums, 60 * 60 * 12)

  return topAlbums.slice(0, 9)
}

const api = { getTopAlbumsCover }

export default api
