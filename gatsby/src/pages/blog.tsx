import React from 'react'
import { graphql, PageProps } from 'gatsby'

import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO'
import Paper from '../components/Shared/Paper'

const Blog: React.FC<PageProps<GatsbyTypes.BlogListingQuery>> = (props) => {
  const postEdges = props.data.allMdx.edges

  return (
    <Layout>
      <SEO
        title="Blog"
        description="Thoughts, tutorials, musings, album reviews and everything in between that I have written down."
        path={props.path}
      />
      <Paper className="listing-container">
        <PostListing
          postEdges={postEdges}
          pathPrefix="blog"
          itemType="BlogPosting"
        />
      </Paper>
    </Layout>
  )
}

export default Blog

/* eslint no-undef: "off" */
export const listingQuery = graphql`
  query BlogListing {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        collection: { eq: "posts" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      edges {
        node {
          slug
          fields {
            latestCommit {
              date
            }
          }
          excerpt
          timeToRead
          frontmatter {
            title
            date
            description
            tags
            cover {
              publicURL
            }
          }
        }
      }
    }
  }
`
