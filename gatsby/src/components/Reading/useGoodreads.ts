import { useStaticQuery, graphql } from 'gatsby'

export default function useGoodreadsShelf() {
  const shelves = useStaticQuery<GatsbyTypes.UseGoodreadsShelvesQuery>(
    graphql`
      query UseGoodreadsShelves {
        currentlyReading: allGoodreadsBook(
          filter: { shelf: { eq: "currently-reading" } }
          sort: { fields: started, order: DESC }
          limit: 1
        ) {
          books: nodes {
            title
            author
            isbn
            url
            started
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 175, quality: 90)
              }
            }
          }
        }
        recentlyFinished: allGoodreadsBook(
          filter: { shelf: { eq: "read" } }
          sort: { fields: finished, order: DESC }
          limit: 11
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
                gatsbyImageData(width: 175, quality: 90)
              }
            }
          }
        }
      }
    `
  )

  return shelves
}
