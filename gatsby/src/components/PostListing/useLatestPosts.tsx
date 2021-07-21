import { useStaticQuery, graphql } from 'gatsby'

export default function useLatestPosts() {
  const query = useStaticQuery<GatsbyTypes.UseLatestPostsQuery>(graphql`
    query UseLatestPosts {
      allMdx(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          collection: { eq: "posts" }
          frontmatter: { draft: { ne: true } }
        }
        limit: 3
      ) {
        posts: nodes {
          frontmatter {
            title
            date
            description
          }
          fields {
            slug
          }
        }
      }
    }
  `)

  return query.allMdx.posts
}
