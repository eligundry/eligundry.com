import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import { CategoryPageQuery, SitePageContext } from '../../graphql-types'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'

interface Props {
  data: CategoryPageQuery
  pageContext: SitePageContext
}

const CategoryTemplate: React.FC<Props> = props => {
  const { category } = props.pageContext
  const postEdges = props.data.allMarkdownRemark.edges
  return (
    <Layout>
      <div className="category-container">
        <Helmet title={`Posts in category "${category}"`} />
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  )
}

export default CategoryTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { eq: $category } } }
    ) {
      totalCount
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
          }
        }
      }
    }
  }
`
