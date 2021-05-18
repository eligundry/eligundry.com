import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO/SEO'
import Paper from '../components/Shared/Paper'

const Listing: React.FC<PageProps<GatsbyTypes.BlogListingQuery>> = props => {
  const postEdges = props.data.allMarkdownRemark.edges

  return (
    <Layout>
      <Paper className="listing-container">
        <Helmet title="Blog" />
        <SEO />
        <PostListing postEdges={postEdges} />
      </Paper>
    </Layout>
  )
}

export default Listing

/* eslint no-undef: "off" */
export const listingQuery = graphql`
  query BlogListing {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        collection: { eq: "posts" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            cover
            date
            description
          }
        }
      }
    }
  }
`
