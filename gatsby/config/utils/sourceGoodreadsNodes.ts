import axios, { AxiosResponse } from 'axios'
import trim from 'lodash/trim'
import { SourceNodesArgs } from 'gatsby'
import { JSDOM } from 'jsdom'

const trimChars = '\n *'

interface GoodreadsQueryArgs {
  userID: string | number
  shelves: ('read' | 'currently-reading' | 'to-read' | string)[]
}

const sourceGoodreadsNodes = async (
  args: SourceNodesArgs,
  query: GoodreadsQueryArgs
) => {
  const { createNodeId, createContentDigest } = args
  const { createNode } = args.actions

  for (const shelf of query.shelves) {
    let goodreadsHTML: AxiosResponse<string> | null

    try {
      goodreadsHTML = await axios.get<string>(
        `https://www.goodreads.com/review/list/${query.userID}`,
        {
          params: {
            ref: 'nav_mybooks',
            shelf,
            per_page: 100,
          },
        }
      )
    } catch (e) {
      console.error('could not fetch Goodreads shelf', e)
      return
    }

    const { document: goodreadsDocument } = new JSDOM(goodreadsHTML.data).window

    Array.from(
      goodreadsDocument.querySelectorAll('#booksBody .bookalike')
    ).forEach(row => {
      const book = {
        title: trim(
          row.querySelector('td.field.title a').getAttribute('title'),
          trimChars
        ),
        author: trim(
          row.querySelector('td.field.author .value').textContent,
          trimChars
        ),
        isbn: trim(
          row.querySelector('td.field.isbn .value').textContent,
          trimChars
        ),
        isbn13: trim(
          row.querySelector('td.field.isbn13 .value').textContent,
          trimChars
        ),
        asin: trim(
          row.querySelector('td.field.asin .value').textContent,
          trimChars
        ),
        pages: parseInt(
          trim(
            row.querySelector('td.field.num_pages .value').textContent,
            trimChars
          )
        ),
        published: getDateField(row, 'td.field.date_pub .value'),
        started: getDateField(row, 'td.field.date_started .date_started_value'),
        finished: getDateField(row, 'td.field.date_read .date_read_value'),
        cover: row
          .querySelector('td.field.cover img')
          .getAttribute('src')
          // Get the full sized thumbnail
          .replace(/\._\w+\d+_/, ''),
        url: `https://www.goodreads.com${row
          .querySelector('td.field.cover a')
          .getAttribute('href')}`,
        shelf,
      }

      createNode({
        id: createNodeId(`goodreads-book-${book.isbn}`),
        parent: null,
        children: [],
        internal: {
          type: 'GoodreadsBook',
          content: JSON.stringify(book),
          contentDigest: createContentDigest(book),
        },
        ...book,
      })
    })
  }
}

const getDateField = (row: Element, selector: string): Date | null => {
  const rawDate = row.querySelector(selector)?.textContent

  if (rawDate) {
    return new Date(trim(rawDate, trimChars))
  }

  return new Date('2000-01-01')
}

export default sourceGoodreadsNodes
