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
  /** Goodreads' ID for the book, taken from its cover image's file name. */
  coverID: string | null
}

function upgradeCoverUrl(url: string): string {
  // Goodreads cover URLs include a size directive like `._SX98_` or `._SY75_`
  // that constrains the image dimensions. Strip it so we fetch the original
  // full-resolution image and let our own resize pipeline downscale.
  return url.replace(/\._S[XY]\d+_/i, '')
}

/** The book ID in a cover URL like `.../books/1761194644l/243042929._SX98_.jpg`. */
function coverID(url: string): string | null {
  return url.match(/\/(\d+)(?:\._[^/]*)?\.\w+$/)?.[1] ?? null
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
      books.push({
        title,
        author,
        cover,
        url,
        rating,
        coverID: rawCover ? coverID(rawCover) : null,
      })
    }
  }

  return books
}

/** A date like "October 29" or "December 12, 2025" from the updates widget, as YYYY-MM-DD. */
function updateDate(text: string, now = new Date()): string | null {
  const hasYear = /\d{4}/.test(text)
  const date = new Date(hasYear ? text : `${text}, ${now.getFullYear()}`)
  if (Number.isNaN(date.getTime())) return null
  // Dates without a year are this year's, unless that's still to come
  if (!hasYear && date > now) date.setFullYear(date.getFullYear() - 1)
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

/**
 * When each recently rated book was rated, keyed by coverID, from the public
 * updates widget. The shelf widget has no dates and review pages need a
 * sign-in, so this is the only public source. It only lists the user's last
 * 10 updates, so older books have no date.
 */
async function fetchRatingDates(userID: string): Promise<Map<string, string>> {
  const url = new URL('https://www.goodreads.com/widgets/user_update_widget')
  url.searchParams.set('user', userID)
  url.searchParams.set('num_updates', '10')

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Goodreads updates widget: ${response.statusText}`
    )
  }

  const doc = new JSDOM(await response.text()).window.document
  const dates = new Map<string, string>()
  // Only the first update of each day has a date
  let date: string | null = null

  for (const update of doc.querySelectorAll('.update')) {
    const dateText = update.querySelector(':scope > p')?.textContent?.trim()
    if (dateText) date = updateDate(dateText)

    const action = update.querySelector('.updateAction')?.textContent ?? ''
    const cover = update.querySelector('.updateImage img')?.getAttribute('src')
    const id = cover ? coverID(cover) : null

    if (date && id && action.includes('rated a book') && !dates.has(id)) {
      dates.set(id, date)
    }
  }

  return dates
}

export const createGoodreadsCollection = (
  params: GoodreadsCollectionOptions
) => {
  return defineCollection({
    loader: async () => {
      const [books, ratingDates] = await Promise.all([
        fetchGoodreadsShelf(params),
        fetchRatingDates(params.userID),
      ])

      // Augment with coverColor
      const augmentedBooks = await Promise.all(
        books.map(async (book) => {
          let coverColor: string | null = null
          if (book.cover) {
            coverColor = await averageColorFromURL(book.cover).catch(() => null)
          }

          const { coverID, ...rest } = book
          return {
            id: book.url,
            ...rest,
            coverColor,
            ratedAt: (coverID && ratingDates.get(coverID)) || null,
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
      coverColor: z.string().nullable(),
      /** When it was rated, as YYYY-MM-DD, for books rated recently enough. */
      ratedAt: z.string().nullable(),
      order: z.number(),
    }),
  })
}
