import { useStaticQuery, graphql } from 'gatsby'

export default function useGoodreadsShelf() {
  const shelves = useStaticQuery<GatsbyTypes.UseGoodreadsShelvesQuery>(
    graphql`
      query UseGoodreadsShelves {
        currentlyReading: allGoodreadsBook(
          filter: { shelf: { eq: "currently-reading" } }
          sort: { fields: started, order: DESC }
          limit: 7
        ) {
          books: nodes {
            title
            author
            isbn
            url
            started
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 250)
              }
            }
          }
        }
        recentlyFinished: allGoodreadsBook(
          filter: { shelf: { eq: "read" } }
          sort: { fields: finished, order: DESC }
          limit: 7
        ) {
          books: nodes {
            finished
            title
            author
            isbn
            url
            started
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 250)
              }
            }
          }
        }
      }
    `
  )

  return shelves
}
