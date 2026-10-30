import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { JSDOM } from 'jsdom'
import { averageColorFromURL } from '../lib/images'
import { withOrder } from '../lib/collections'

interface GoodreadsCollectionOptions {
  userID: string
  shelf: string
  limit?: number
  sort?: 'date_read' | 'date_added' | 'title'
  order?: 'a' | 'd'
}

interface GoodreadsBook {
  title: string
  author: string
  cover: string
  url: string
  rating: number
  /** When it was read, as YYYY-MM-DD. The shelf widget doesn't say, so null. */
  reviewedAt: string | null
}

function upgradeCoverUrl(url: string): string {
  // Goodreads cover URLs include a size directive like `._SX98_` or `._SY75_`
  // that constrains the image dimensions. Strip it so we fetch the original
  // full-resolution image and let our own resize pipeline downscale.
  return url.replace(/\._S[XY]\d+_/i, '')
}

/**
 * The HTML that a Goodreads custom widget script writes into the page. The
 * script is `var widget_code = '<html>'` followed by code that inserts it, with
 * the HTML escaped as a single-quoted JavaScript string.
 */
function widgetHTML(script: string): string | null {
  const literal = script.match(/var widget_code = '([\s\S]*?)'\n/)?.[1]
  return literal ? literal.replace(/\\n/g, '\n').replace(/\\(.)/g, '$1') : null
}

/**
 * Goodreads retired its shelf RSS feeds in October 2026, and shelf pages need
 * a sign-in, so this reads the public custom shelf widget that Goodreads offers
 * for embedding on other sites.
 */
async function fetchGoodreadsShelf({
  userID,
  shelf,
  limit = 100,
  sort,
  order,
}: GoodreadsCollectionOptions): Promise<GoodreadsBook[]> {
  const url = new URL(
    `https://www.goodreads.com/review/custom_widget/${userID}`
  )
  url.searchParams.set('shelf', shelf)
  url.searchParams.set('num_books', limit.toString())
  if (sort) url.searchParams.set('sort', sort)
  if (order) url.searchParams.set('order', order)
  // Goodreads caches a widget's books by widget_id and ignores the other
  // parameters on later requests for the same ID, so use a new one each build.
  url.searchParams.set('widget_id', `${shelf}-${Date.now()}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Goodreads shelf widget: ${response.statusText}`
    )
  }

  const html = widgetHTML(await response.text())
  if (!html) {
    throw new Error('Goodreads shelf widget had no widget_code')
  }

  const doc = new JSDOM(html).window.document
  const books: GoodreadsBook[] = []

  for (const item of doc.querySelectorAll(
    '[class^="gr_custom_each_container"]'
  )) {
    if (books.length >= limit) break

    const coverLink = item.querySelector(
      '[class^="gr_custom_book_container"] a'
    )
    const title = coverLink?.getAttribute('title')?.trim()
    const author = item
      .querySelector('[class^="gr_custom_author"] a')
      ?.textContent?.trim()
    const rawCover = coverLink?.querySelector('img')?.getAttribute('src')
    const cover = rawCover ? upgradeCoverUrl(rawCover) : undefined
    const href = coverLink?.getAttribute('href')
    const url = href ? href.split('?')[0] : undefined
    const rating = item.querySelectorAll(
      '.staticStars img[src*="star_active"]'
    ).length

    if (title && author && cover && url) {
      books.push({ title, author, cover, url, rating, reviewedAt: null })
    }
  }

  return books
}

export const createGoodreadsCollection = (
  params: GoodreadsCollectionOptions
) => {
  return defineCollection({
    loader: async () => {
      // Build without books rather than failing the build if Goodreads
      // changes the widget too.
      const books = await fetchGoodreadsShelf(params).catch((error) => {
        console.warn(
          `Skipping Goodreads shelf "${params.shelf}": ${error.message}`
        )
        return []
      })

      // Augment with coverColor
      const augmentedBooks = await Promise.all(
        books.map(async (book) => {
          let coverColor: string | null = null
          if (book.cover) {
            coverColor = await averageColorFromURL(book.cover).catch(() => null)
          }

          return {
            id: book.url,
            ...book,
            coverColor,
          }
        })
      )

      // A remote image that fails to load fails the build. averageColorFromURL
      // returns null when it couldn't fetch the cover, so drop those books.
      return withOrder(
        augmentedBooks.filter((book) => book.coverColor !== null)
      )
    },
    schema: z.object({
      title: z.string(),
      author: z.string(),
      cover: z.string(),
      url: z.string(),
      rating: z.number(),
      reviewedAt: z.string().nullable(),
      coverColor: z.string().nullable(),
      order: z.number(),
    }),
  })
}
