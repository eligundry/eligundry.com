import React from 'react'
import { graphql, PageProps } from 'gatsby'

import Paper from '../components/Shared/Paper'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO'

const Talks: React.FC<PageProps<GatsbyTypes.TalkListingQuery>> = (props) => {
  const postEdges = props.data.allMdx.edges

  return (
    <Layout>
      <SEO
        title="Talks"
        description="Talks that I have given at meetups and conferences."
        path={props.path}
      />
      <Paper className="listing-container">
        <PostListing
          postEdges={postEdges}
          pathPrefix="talks"
          itemType="CreativeWork"
        />
      </Paper>
    </Layout>
  )
}

export default Talks

export const talkListingQuery = graphql`
  query TalkListing {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        collection: { eq: "talks" }
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
            tags
            date
            description
          }
        }
      }
    }
  }
`
