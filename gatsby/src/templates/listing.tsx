import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO'
import Paper from '../components/Shared/Paper'

const Listing: React.FC<PageProps<GatsbyTypes.BlogListingQuery>> = props => {
  const posts = props.data.allMdx.nodes

  return (
    <Layout>
      <Paper className="listing-container">
        <Helmet title="Blog" />
        <SEO path={props.path} />
        <main>
          <PostListing posts={posts} pathPrefix="blog" />
        </main>
      </Paper>
    </Layout>
  )
}

export default Listing

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
      nodes {
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
`
