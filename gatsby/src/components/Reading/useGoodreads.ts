import { useQuery } from 'react-query'

export default function useGoodreadsShelf(accountID: string, shelf: string) {
  const { isFetching, error, data: books } = useQuery(
    ['goodreads', accountID, shelf],
    async () => {
      const resp = await fetch(
        `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/review/list/${accountID}?ref=nav_mybooks&shelf=${shelf}`
      )

      if (!resp.ok) {
        throw resp
      }

      const parser = new DOMParser()
      const goodreadsDocument = parser.parseFromString(
        await resp.text(),
        'text/html'
      )

      return Array.from(
        goodreadsDocument.querySelectorAll('#booksBody .bookalike')
      ).map(row => ({
        isbn: row.querySelector('td.field.isbn .value').textContent,
        title: row.querySelector('td.field.title a').getAttribute('title'),
        author: row.querySelector('td.field.author .value').textContent,
        cover: row
          .querySelector('td.field.cover img')
          .getAttribute('src')
          // Get the full sized thumbnail
          .replace(/\._\w+\d+_/, ''),
        url: `https://www.goodreads.com/${row
          .querySelector('td.field.cover a')
          .getAttribute('href')}`,
      }))
    }
  )

  return { isFetching, error, books }
}
