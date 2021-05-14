import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import formatISO from 'date-fns/formatISO'
import tw, { styled } from 'twin.macro'

import Layout from '../layout'
import Paper from '../components/Shared/Paper'
import SEO from '../components/SEO/SEO'
import { TalkBySlugQuery, SitePageContext } from '../../graphql-types'
import './talk.css'
import './prism-material-light.css'

interface Props {
  data: TalkBySlugQuery
  pageContext: SitePageContext
}

const Article = styled(Paper.article)``

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
      <Article className="talk">
        <header>
          <h1>{talk.title}</h1>
          <time dateTime={talk.date}>
            <span role="img" aria-labelledby="date of talk">
              🗓
            </span>
            {formatISO(new Date(talk.date), { representation: 'date' })}
          </time>
          <p className="location">
            <span role="img" aria-labelledby="location of talk">
              📍
            </span>
            {talk.location}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: talkNode.html }} />
      </Article>
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
