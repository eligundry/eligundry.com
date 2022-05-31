import LastFM from 'lastfm-typed'
import type { getRecentTracks } from 'lastfm-typed/dist/interfaces/userInterface'
import NodeCache from 'node-cache'
import getUnixTime from 'date-fns/getUnixTime'
import subWeeks from 'date-fns/subWeeks'
import groupBy from 'lodash/groupBy'

import utils from './utils'

export type RecentTrack = getRecentTracks['tracks'][number]
export interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string
  placeholder: string
}

if (!process.env.LAST_FM_API_KEY) {
  throw new Error('LAST_FM_API_KEY must be defined for the site to run')
}

const lastfm = new LastFM(process.env.LAST_FM_API_KEY)
const cache = new NodeCache({
  stdTTL: 60 * 60 * 1000,
})

const getTopAlbumsCover = async (
  username: string
): Promise<LastFMCoverItem[]> => {
  let topAlbums = cache.get<LastFMCoverItem[]>('lastfm-cover')

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
      .map(async (album) => ({
        album: album.name,
        artist: album.artist.name,
        count: album.playcount,
        cover: album.image.at(-1)?.url ?? '',
        placeholder: await utils.getPlaceholderForImage(album.image[0].url),
      }))
  )

  cache.set('lastfm-cover', topAlbums)

  return topAlbums.slice(0, 9)
}

const api = { getTopAlbumsCover }

export default api
