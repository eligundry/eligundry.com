import { useStaticQuery, graphql } from 'gatsby'

interface GoodreadsBook {
  title: string
  author: string
  cover: string
  isbn: string
  url: string
}

export default function useGoodreadsShelf(): GoodreadsBook[] {
  const queryResult = useStaticQuery<GatsbyTypes.UseGoodreadsShelfQuery>(
    graphql`
      query UseGoodreadsShelf {
        allGoodreadsBook {
          books: nodes {
            title
            author
            cover
            isbn
            url
          }
        }
      }
    `
  )

  return queryResult.allGoodreadsBook.books
}
