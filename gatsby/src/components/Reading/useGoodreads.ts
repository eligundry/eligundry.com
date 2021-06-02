import { useStaticQuery, graphql } from 'gatsby'

export default function useGoodreadsShelf() {
  const queryResult = useStaticQuery<GatsbyTypes.UseGoodreadsShelfQuery>(
    graphql`
      query UseGoodreadsShelf {
        allGoodreadsBook(sort: { fields: started, order: DESC }) {
          books: nodes {
            title
            author
            isbn
            url
            started
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
