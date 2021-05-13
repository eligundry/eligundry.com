import { useStaticQuery, graphql } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'

interface GoodreadsBook {
  title: string
  author: string
  isbn: string
  url: string
  coverImage: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

export default function useGoodreadsShelf(): GoodreadsBook[] {
  const queryResult = useStaticQuery<GatsbyTypes.UseGoodreadsShelfQuery>(
    graphql`
      query UseGoodreadsShelf {
        allGoodreadsBook {
          books: nodes {
            title
            author
            isbn
            url
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 200)
              }
            }
          }
        }
      }
    `
  )

  return queryResult.allGoodreadsBook.books
}
