import LastFM from 'lastfm-typed'
import type { getRecentTracks } from 'lastfm-typed/dist/interfaces/userInterface'
import { cache } from './cache'

export type RecentTrack = getRecentTracks['tracks'][number]
export interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string
}

if (!import.meta.env.LAST_FM_API_KEY) {
  throw new Error('LAST_FM_API_KEY must be defined for the site to run')
}

const lastfm = new LastFM(import.meta.env.LAST_FM_API_KEY)
const getTopAlbumsCover = async (
  username: string
): Promise<LastFMCoverItem[]> => {
  let topAlbums = await cache.get<LastFMCoverItem[]>('lastfm-cover')

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
      .map(
        async (album): Promise<LastFMCoverItem> => ({
          album: album.name,
          artist: album.artist.name,
          count: album.playcount,
          cover: album.image.at(-1)?.url ?? '',
        })
      )
  )

  cache.set('lastfm-cover', topAlbums, {
    ttl: 60 * 60 * 12 * 1000,
  })

  return topAlbums.slice(0, 9)
}

const api = { getTopAlbumsCover }

export default api