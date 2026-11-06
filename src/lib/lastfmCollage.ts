import { getWeek } from 'date-fns'
import * as PureImage from 'pureimage'
import { Readable, Writable } from 'node:stream'
import bsky from './bluesky'
import config from '../config'
import { getTopAlbums, type LastFMPeriod } from './lastfmClient'

/**
 * Builds the 3x3 album collage and posts it to Bluesky. It's kept apart from
 * ./lastfm, which averages each cover's color with sharp for the homepage,
 * so that nothing here pulls in a native module: this code has to run in a
 * Cloudflare Worker's scheduled handler as well as on Netlify.
 */

export type CollagePeriod = '7day' | '1month' | '12month'

interface CollageAlbum {
  album: string
  artist: string
  count: number
  hires: string
}

const getCollageAlbums = async (
  username: string,
  period: LastFMPeriod
): Promise<CollageAlbum[]> => {
  const albums = await getTopAlbums(username, period)

  return albums
    .filter((album) => album.image.length > 0)
    .map((album) => ({
      album: album.name,
      artist: album.artist.name,
      count: album.playcount,
      // image[3] is "extralarge" (300px), one collage tile
      hires: album.image.at(3)?.url ?? '',
    }))
}

export const getCollage = async (
  username: string,
  period: LastFMPeriod = '7day'
) => {
  const albums = await getCollageAlbums(username, period)
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

export type PostCollageResult =
  | { ok: true; period: CollagePeriod; alt: string }
  | { ok: false; period: CollagePeriod; skipped: true; reason: string }

/**
 * Posts the collage of the top albums for `period` to Bluesky, unless fewer
 * than nine albums were played.
 */
export const postCollage = async (
  period: CollagePeriod
): Promise<PostCollageResult> => {
  const { albums: topAlbums, collage } = await getCollage(
    config.lastFmUsername,
    period
  )

  if (topAlbums.length < 9) {
    return {
      ok: false,
      period,
      skipped: true,
      reason: `Not enough albums to post (got ${topAlbums.length}, need 9)`,
    }
  }

  const alt = topAlbums
    .slice(0, 9)
    .map(
      (album) => `${album.album} by ${album.artist} [${album.count} scrobbles]`
    )
    .join(', ')
  const now = new Date()
  const text = {
    '7day': `Happy Friday! Here's what I've been listening to this week! https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}/week/${getWeek(now)}`,
    '1month': `What a month! Here's what I've been listening to! https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}/month/${now.getMonth() + 1}`,
    '12month': `What a year! Here's what I've been listening to! https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}`,
  }

  const upload = await bsky.uploadImage(collage, 'image/jpeg')
  await bsky.sendPost(text[period], {
    embed: {
      $type: 'app.bsky.embed.images',
      images: [
        {
          image: upload.data.blob,
          alt: `Last.fm collage: ${alt}`,
        },
      ],
    },
  })

  return { ok: true, period, alt }
}
