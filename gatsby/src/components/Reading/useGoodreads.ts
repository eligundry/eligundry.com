import { useStaticQuery, graphql } from 'gatsby'

export default function useGoodreadsShelf() {
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
