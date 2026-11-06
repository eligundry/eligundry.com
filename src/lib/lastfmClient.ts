import LastFM from 'lastfm-typed'
import type {
  getRecentTracks,
  getTopAlbums as TopAlbums,
} from 'lastfm-typed/dist/interfaces/userInterface'

export type RecentTrack = getRecentTracks['tracks'][number]
export interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string
  hires: string
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

export type LastFMTopAlbum = TopAlbums['albums'][number]

let client: LastFM | undefined

/**
 * The key is read when first needed, from process.env, so it never gets
 * written into the Worker bundle: Vite inlines import.meta.env values at
 * build time. In the Worker, process.env holds its secrets.
 */
function getClient(): LastFM {
  if (client) {
    return client
  }

  const key = process.env.LAST_FM_API_KEY

  if (!key) {
    throw new Error('LAST_FM_API_KEY must be defined for the site to run')
  }

  try {
    // @ts-ignore
    client = new LastFM.default(key) as LastFM
  } catch (e) {
    client = new LastFM(key)
  }

  return client
}

export const getTopAlbums = async (
  username: string,
  period: LastFMPeriod = '7day'
) => {
  const topAlbums = await getClient()
    .user.getTopAlbums(username, {
      period,
      limit: 15,
    })
    .then((resp) => resp.albums)

  if (!topAlbums) {
    throw new Error('Could not fetch top albums')
  }

  return topAlbums
}
