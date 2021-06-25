import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO'
import Paper from '../components/Shared/Paper'

const Listing: React.FC<PageProps<GatsbyTypes.BlogListingQuery>> = props => {
  const postEdges = props.data.allMarkdownRemark.edges

  return (
    <Layout>
      <Paper className="listing-container">
        <Helmet title="Blog" />
        <SEO path={props.path} />
        <PostListing postEdges={postEdges} pathPrefix="blog" />
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
            latestCommitDate
          }
          excerpt
          timeToRead
          frontmatter {
            title
            date
            description
            cover {
              publicURL
            }
          }
        }
      }
    }
  }
`
