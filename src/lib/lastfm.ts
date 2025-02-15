import LastFM from 'lastfm-typed'
import type {
  getRecentTracks,
  getTopAlbums,
} from 'lastfm-typed/dist/interfaces/userInterface'
import { averageColorFromURL } from './images'
import * as PureImage from 'pureimage'
import { Readable, Writable } from 'node:stream'

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
  const canvas = PureImage.make(900, 900)
  const ctx = canvas.getContext('2d')

  // Fill background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 900, 900)

  // Load and draw all images
  await Promise.all(
    first9Albums.map(async (album, index) => {
      try {
        const response = await fetch(album.hires)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Check image format by looking at magic numbers
        const signature = buffer.slice(0, 4).toString('hex')
        const stream = Readable.from(buffer)

        let img
        if (signature.startsWith('89504e47')) {
          // PNG
          img = await PureImage.decodePNGFromStream(stream)
        } else if (signature.startsWith('ffd8')) {
          // JPEG
          img = await PureImage.decodeJPEGFromStream(stream)
        } else {
          throw new Error(`Unsupported image format: ${signature}`)
        }

        const row = Math.floor(index / 3)
        const col = index % 3
        const x = col * 300
        const y = row * 300

        // Draw image
        ctx.drawImage(img, x, y, 300, 300)
      } catch (error) {
        console.error(
          `Failed to load image for ${album.album} (${album.hires}):`,
          error
        )
        // Draw placeholder for failed image
        ctx.fillStyle = '#333333'
        const row = Math.floor(index / 3)
        const col = index % 3
        ctx.fillRect(col * 300, row * 300, 300, 300)
      }
    })
  )

  // Create a buffer from the JPEG data
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      },
      final(callback) {
        callback()
        // @ts-expect-error Node's various streams and buffer types are mess
        resolve(Buffer.concat(chunks))
      },
    })

    writable.on('error', reject)
    PureImage.encodeJPEGToStream(canvas, writable)
  })

  return {
    collage: buffer,
    albums: first9Albums,
  }
}

const api = { getTopAlbumsCover, getTopAlbums, getCollage }

export default api
