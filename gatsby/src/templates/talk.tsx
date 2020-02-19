import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import formatISO from 'date-fns/formatISO'

import Layout from '../layout'
import SEO from '../components/SEO/SEO'
import { TalkBySlugQuery, SitePageContext } from '../../graphql-types'

interface Props {
  data: TalkBySlugQuery
  pageContext: SitePageContext
}

const TalkTemplate: React.FC<Props> = props => {
  const { data, pageContext } = props
  const { slug } = pageContext
  const talkNode = data.markdownRemark
  const talk = talkNode.frontmatter

  return (
    <Layout>
      <Helmet>
        <title>{talk.title}</title>
      </Helmet>
      <SEO postPath={slug} postNode={talkNode} postSEO />
      <article>
        <header>
          <h1>{talk.title}</h1>
          <time dateTime={talk.date}>
            🗓
            {formatISO(new Date(talk.date), { representation: 'date' })}
          </time>
          <p>{talk.location}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: talkNode.html }} />
      </article>
    </Layout>
  )
}

export default TalkTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TalkBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        date
        category
        tags
        description
        location
      }
      fields {
        slug
        date
      }
    }
  }
`
