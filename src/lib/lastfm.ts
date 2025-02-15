import LastFM from 'lastfm-typed'
import type {
  getRecentTracks,
  getTopAlbums,
} from 'lastfm-typed/dist/interfaces/userInterface'
import { averageColorFromURL } from './images'
import { createCanvas, loadImage } from 'canvas'

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

const getCollage = async (username: string, period: LastFMPeriod = '7day') => {
  // Get top albums
  const albums = await getTopAlbumsCover(username, period)
  const first9Albums = albums.slice(0, 9)

  // Create canvas
  const canvas = createCanvas(900, 900) // 300x300 per album
  const ctx = canvas.getContext('2d')

  // Fill background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 900, 900)

  // Load and draw all images
  await Promise.all(
    first9Albums.map(async (album, index) => {
      try {
        const img = await loadImage(album.hires)
        const row = Math.floor(index / 3)
        const col = index % 3
        const x = col * 300
        const y = row * 300

        // Draw image
        ctx.drawImage(img, x, y, 300, 300)
      } catch (error) {
        console.error(`Failed to load image for ${album.album}:`, error)
        // Draw placeholder for failed image
        ctx.fillStyle = '#333333'
        const row = Math.floor(index / 3)
        const col = index % 3
        ctx.fillRect(col * 300, row * 300, 300, 300)
      }
    })
  )

  // Convert to buffer
  return {
    collage: canvas.toBuffer('image/jpeg', { quality: 0.9 }),
    albums: first9Albums,
  }
}

const api = { getTopAlbumsCover, getTopAlbums, getCollage }

export default api
