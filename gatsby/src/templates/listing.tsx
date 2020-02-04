import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import { ListingQueryQuery } from '../../graphql-types'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO/SEO'

interface Props {
  data: ListingQueryQuery
}

const Listing: React.FC<Props> = props => {
  const postEdges = props.data.allMarkdownRemark.edges

  return (
    <Layout>
      <div className="listing-container">
        <div className="posts-container">
          <Helmet title="Blog" />
          <SEO />
          <PostListing postEdges={postEdges} />
        </div>
      </div>
    </Layout>
  )
}

export default Listing

/* eslint no-undef: "off" */
export const listingQuery = graphql`
  query ListingQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      limit: $limit
      skip: $skip
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
            tags
            cover
            date
            description
          }
        }
      }
    }
  }
`
