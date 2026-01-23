import { defineCollection, z } from 'astro:content'
import { JSDOM } from 'jsdom'
import { averageColorFromURL } from '../lib/images'

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
}

async function fetchGoodreadsShelf({
  userID,
  shelf,
  limit = 100,
  sort,
  order,
}: GoodreadsCollectionOptions): Promise<GoodreadsBook[]> {
  const url = new URL(`https://www.goodreads.com/review/list_rss/${userID}`)
  url.searchParams.set('shelf', shelf)
  if (sort) url.searchParams.set('sort', sort)
  if (order) url.searchParams.set('order', order)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch Goodreads RSS: ${response.statusText}`)
  }

  const xml = await response.text()
  const dom = new JSDOM(xml, { contentType: 'text/xml' })
  const doc = dom.window.document

  const items = doc.querySelectorAll('item')
  const books: GoodreadsBook[] = []

  for (const item of items) {
    if (books.length >= limit) break

    const title = item.querySelector('title')?.textContent?.trim()
    const author = item.querySelector('author_name')?.textContent?.trim()
    const cover = item
      .querySelector('book_large_image_url')
      ?.textContent?.trim()
    const url = item.querySelector('link')?.textContent?.trim()
    const ratingStr = item.querySelector('user_rating')?.textContent?.trim()
    const rating = ratingStr ? parseInt(ratingStr, 10) : 0

    if (title && author && cover && url) {
      books.push({ title, author, cover, url, rating })
    }
  }

  return books
}

export const createGoodreadsCollection = (
  params: GoodreadsCollectionOptions
) => {
  return defineCollection({
    loader: async () => {
      const books = await fetchGoodreadsShelf(params)

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

      return augmentedBooks
    },
    schema: z.object({
      title: z.string(),
      author: z.string(),
      cover: z.string(),
      url: z.string(),
      rating: z.number(),
      coverColor: z.string().nullable(),
    }),
  })
}
