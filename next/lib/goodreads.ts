import type { AxiosResponse } from 'axios'
import { JSDOM } from 'jsdom'
import trim from 'lodash/trim'
import NodeCache from 'node-cache'
import retry from 'async-retry'

import { cacheAxios } from './axios'

const cache = new NodeCache({
  stdTTL: 60 * 60 * 24 * 1000,
})

export interface GoodReadsBook {
  title: string | null
  author: string | null
  isbn: string | null
  isbn13: string | null
  asin: string | null
  pages: number | null
  published: string | null
  started: string | null
  finished: string | null
  cover: string | null
  thumbnail: string | null | undefined
  url: string | null
}

const getShelf = async (userID: string, shelf: string, limit?: number) => {
  const cacheKey = `goodreads-user[${userID}]-shelf[${shelf}]-limit[${
    limit ?? 'all'
  }]`
  let books = cache.get<GoodReadsBook[]>(cacheKey)

  if (books) {
    return books
  }

  let goodreadsHTML: AxiosResponse<string> | null

  try {
    goodreadsHTML = await retry(
      async () =>
        cacheAxios.get<string>(
          `https://www.goodreads.com/review/list/${userID}`,
          {
            params: {
              ref: 'nav_mybooks',
              shelf,
              per_page: 100,
            },
          }
        ),
      { retries: 3 }
    )
  } catch (e) {
    console.error('could not fetch Goodreads shelf', e)
    throw e
  }

  const { document: goodreadsDocument } = new JSDOM(goodreadsHTML.data).window

  books = await Promise.all(
    Array.from(goodreadsDocument.querySelectorAll('#booksBody .bookalike'))
      .map((row): GoodReadsBook | null => {
        const thumbnail = row
          ?.querySelector('td.field.cover img')
          ?.getAttribute('src')
        // Get the full sized thumbnail
        const cover = thumbnail?.replace(/\._\w+\d+_/, '')

        const urlPath = row
          ?.querySelector('td.field.cover a')
          ?.getAttribute('href')

        if (!cover || !urlPath) {
          return null
        }

        return {
          title: customTrim(
            row?.querySelector('td.field.title a')?.getAttribute('title')
          ),
          author: customTrim(
            row?.querySelector('td.field.author .value')?.textContent
          ),
          isbn: customTrim(
            row?.querySelector('td.field.isbn .value')?.textContent
          ),
          isbn13: customTrim(
            row?.querySelector('td.field.isbn13 .value')?.textContent
          ),
          asin: customTrim(
            row?.querySelector('td.field.asin .value')?.textContent
          ),
          pages: parseInt(
            customTrim(
              row?.querySelector('td.field.num_pages .value')?.textContent
            ) || '0'
          ),
          published: getDateField(row, 'td.field.date_pub .value'),
          started: getDateField(
            row,
            'td.field.date_started .date_started_value'
          ),
          finished: getDateField(row, 'td.field.date_read .date_read_value'),
          cover,
          thumbnail,
          url: urlPath ? `https://www.goodreads.com${urlPath}` : null,
        }
      })
      .filter((book): book is GoodReadsBook => !!book)
      .slice(0, limit)
  )

  cache.set(cacheKey, books)

  return books
}

const trimChars = '\n *'

const getDateField = (row: Element, selector: string): string | null => {
  const rawDate = row.querySelector(selector)?.textContent

  if (rawDate && !rawDate.includes('unknown')) {
    return new Date(trim(rawDate, trimChars)).toISOString()
  }

  return new Date('2000-01-01').toISOString()
}

const customTrim = (value: string | undefined | null): string | null =>
  value ? trim(value, trimChars) : null

const api = { getShelf }

export default api
