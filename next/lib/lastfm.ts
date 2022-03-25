import LastFM from 'lastfm-typed'
import type { getRecentTracks } from 'lastfm-typed/dist/interfaces/userInterface'
import NodeCache from 'node-cache'
import getUnixTime from 'date-fns/getUnixTime'
import subWeeks from 'date-fns/subWeeks'
import groupBy from 'lodash/groupBy'

export type RecentTrack = getRecentTracks['tracks'][number]
export interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string | undefined
}

const lastfm = new LastFM(process.env.LAST_FM_API_KEY)
const cache = new NodeCache({
  stdTTL: 60 * 60 * 1000,
})

export const getScrobblesForWindow = async (
  username: string,
  start: Date,
  end: Date = new Date()
): Promise<RecentTrack[]> => {
  const cachedScrobbles = cache.get<RecentTrack[]>(
    `lastfm-scrobbles-${username}`
  )

  if (cachedScrobbles) {
    return cachedScrobbles
  }

  const scrobbles: RecentTrack[] = []

  let page = await lastfm.user.getRecentTracks(username, {
    from: getUnixTime(start).toString(),
    to: getUnixTime(end).toString(),
  })

  scrobbles.push(...page.tracks.filter((scrobble) => !scrobble.nowplaying))

  for (let i = 1, { totalPages } = page.meta; i < totalPages; i++) {
    page = await lastfm.user.getRecentTracks(username, {
      from: getUnixTime(start).toString(),
      to: getUnixTime(end).toString(),
      page: i + 1,
    })

    scrobbles.push(...page.tracks.filter((scrobble) => !scrobble.nowplaying))
  }

  cache.set<RecentTrack[]>(`lastfm-scrobbles-${username}`, scrobbles)

  return scrobbles
}

export const getTopAlbumsCover = async (
  username: string
): Promise<LastFMCoverItem[]> => {
  const scrobbles = await getScrobblesForWindow(
    username,
    subWeeks(new Date(), 1)
  )
  const groupedScrobbles = groupBy(scrobbles, (scrobble) => scrobble.album.mbid)
  const topAlbums = Object.values(groupedScrobbles)
    .map(
      (group): LastFMCoverItem => ({
        album: group[0].album.name,
        artist: group[0].artist.name,
        count: group.length,
        cover: group[0].image.at(-1)?.url,
      })
    )
    .sort((a, b) => {
      if (b.count === a.count) {
        return (b?.album ?? '') > (a?.album ?? '') ? -1 : 1
      }

      return b.count - a.count
    })
    .slice(0, 9)

  return topAlbums
}

export default { getScrobblesForWindow, getTopAlbumsCover }
