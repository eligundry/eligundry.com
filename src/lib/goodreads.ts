import axios, { type AxiosResponse } from 'axios'
import { JSDOM } from 'jsdom'
import trim from 'lodash/trim'

import { averageColorFromURL } from './images'

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
  coverColor: string | null
}

export interface GetShelf {
  userID: string
  shelf: string
  limit?: number
  sort?: 'date_read' | 'date_added' | 'title'
  order?: 'a' | 'd'
}

const getShelf = async ({ userID, shelf, limit, ...queryParams }: GetShelf) => {
  let goodreadsHTML: AxiosResponse<string> | null

  try {
    goodreadsHTML = await axios.get<string>(
      `https://www.goodreads.com/review/list/${userID}`,
      {
        params: {
          ref: 'nav_mybooks',
          shelf,
          per_page: 100,
          ...queryParams,
        },
      }
    )
  } catch (e) {
    console.error('could not fetch Goodreads shelf', e)
    throw e
  }

  if (!goodreadsHTML) {
    throw new Error('could not fetch Goodreads shelf')
  }

  const { document: goodreadsDocument } = new JSDOM(goodreadsHTML.data).window

  const books = (
    await Promise.all(
      Array.from(
        goodreadsDocument.querySelectorAll('#booksBody .bookalike')
      ).map(async (row): Promise<GoodReadsBook | null> => {
        const thumbnail = row
          ?.querySelector('td.field.cover img')
          ?.getAttribute('src')
        // Resize the thumbnail to be 150px wide
        const cover = thumbnail?.replace(/\._\w+\d+_/, '._SX150_')

        const urlPath = row
          ?.querySelector('td.field.cover a')
          ?.getAttribute('href')

        if (!cover || !urlPath) {
          return null
        }

        const coverColor = await averageColorFromURL(cover).catch(() => null)

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
          coverColor,
        }
      })
    )
  )
    .filter((book): book is GoodReadsBook => !!book)
    .slice(0, limit)

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
