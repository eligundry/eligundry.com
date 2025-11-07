import { defineLiveCollection, type LiveLoader } from 'astro:content'
import { z } from 'zod'
import lastfm, { type LastFMPeriod, type LastFMCoverItem } from './lib/lastfm'
import goodreads, { type GetShelf, type GoodReadsBook } from './lib/goodreads'
import config from './config'

// 24 hours in milliseconds
const CACHE_EXPIRY_24H = 24 * 60 * 60 * 1000

// Live loader for Last.fm album covers
const lastfmCoverLoader = (
  username: string,
  period: LastFMPeriod = '7day'
): LiveLoader<LastFMCoverItem> => {
  return {
    name: 'lastfm-cover-loader',
    loadCollection: async () => {
      try {
        const covers = await lastfm.getTopAlbumsCover(username, period)
        const now = new Date()

        return {
          entries: covers.map((album) => ({
            id: album.url,
            data: album,
          })),
          cacheHint: {
            lastModified: now,
            tags: ['lastfm', 'albums'],
          },
        }
      } catch (error) {
        return {
          error: new Error(
            `Failed to load Last.fm covers: ${error instanceof Error ? error.message : 'Unknown error'}`
          ),
        }
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        // For single entry, we need to fetch all and find the specific one
        // This is not ideal but Last.fm API doesn't support single album lookup in this way
        const covers = await lastfm.getTopAlbumsCover(username, period)
        const album = covers.find((a) => a.url === filter)

        if (!album) {
          return {
            error: new Error('Album not found'),
          }
        }

        return {
          id: album.url,
          data: album,
          cacheHint: {
            lastModified: new Date(),
            tags: ['lastfm', 'albums'],
          },
        }
      } catch (error) {
        return {
          error: new Error(
            `Failed to load Last.fm cover: ${error instanceof Error ? error.message : 'Unknown error'}`
          ),
        }
      }
    },
  }
}

// Live loader for Goodreads books
const goodreadsLoader = (params: GetShelf): LiveLoader<GoodReadsBook> => {
  return {
    name: 'goodreads-loader',
    loadCollection: async () => {
      try {
        const books = await goodreads.getShelf(params)
        const now = new Date()

        return {
          entries: books.map((book) => ({
            id: book.url!,
            data: book,
          })),
          cacheHint: {
            lastModified: now,
            tags: ['goodreads', params.shelf],
          },
        }
      } catch (error) {
        return {
          error: new Error(
            `Failed to load Goodreads shelf: ${error instanceof Error ? error.message : 'Unknown error'}`
          ),
        }
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        // For single entry, we need to fetch all and find the specific one
        const books = await goodreads.getShelf(params)
        const book = books.find((b) => b.url === filter)

        if (!book) {
          return {
            error: new Error('Book not found'),
          }
        }

        return {
          id: book.url!,
          data: book,
          cacheHint: {
            lastModified: new Date(),
            tags: ['goodreads', params.shelf],
          },
        }
      } catch (error) {
        return {
          error: new Error(
            `Failed to load Goodreads book: ${error instanceof Error ? error.message : 'Unknown error'}`
          ),
        }
      }
    },
  }
}

// Define live collections
const lastfmCovers = defineLiveCollection({
  loader: lastfmCoverLoader(config.lastFmUsername),
  schema: z.object({
    album: z.string(),
    artist: z.string(),
    count: z.number(),
    cover: z.string(),
    hires: z.string(),
    coverColor: z.string().nullable(),
    url: z.string().url(),
  }),
})

const currentlyReading = defineLiveCollection({
  loader: goodreadsLoader({
    userID: config.goodreadsUserID,
    shelf: 'currently-reading',
    limit: 2,
  }),
  schema: z.object({
    title: z.string().nullable(),
    author: z.string().nullable(),
    isbn: z.string().nullable(),
    isbn13: z.string().nullable(),
    asin: z.string().nullable(),
    pages: z.number().nullable(),
    published: z.string().nullable(),
    started: z.string().nullable(),
    finished: z.string().nullable(),
    cover: z.string().nullable(),
    thumbnail: z.string().nullable().optional(),
    url: z.string().nullable(),
    coverColor: z.string().nullable(),
  }),
})

const recentlyRead = defineLiveCollection({
  loader: goodreadsLoader({
    userID: config.goodreadsUserID,
    shelf: 'read',
    limit: 16,
    sort: 'date_read',
    order: 'd',
  }),
  schema: z.object({
    title: z.string().nullable(),
    author: z.string().nullable(),
    isbn: z.string().nullable(),
    isbn13: z.string().nullable(),
    asin: z.string().nullable(),
    pages: z.number().nullable(),
    published: z.string().nullable(),
    started: z.string().nullable(),
    finished: z.string().nullable(),
    cover: z.string().nullable(),
    thumbnail: z.string().nullable().optional(),
    url: z.string().nullable(),
    coverColor: z.string().nullable(),
  }),
})

export const collections = {
  lastfmCovers,
  currentlyReading,
  recentlyRead,
}
