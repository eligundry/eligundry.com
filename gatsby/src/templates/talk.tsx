import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'
import formatISO from 'date-fns/formatISO'
import tw, { styled } from 'twin.macro'

import Layout from '../layout'
import Paper from '../components/Shared/Paper'
import SEO from '../components/SEO'
import EmojiText from '../components/Shared/EmojiText'
import Time from '../components/Shared/Time'
import './talk.css'
import './prism-material-light.css'

const Article = styled<React.FC<{ className?: string }>>(Paper.article)``

const TalkTemplate: React.FC<PageProps<
  GatsbyTypes.TalkBySlugQuery
>> = props => {
  const { data, path } = props
  const talkNode = data.markdownRemark
  const talk = talkNode?.frontmatter

  if (!talk?.title) {
    return null
  }

  return (
    <Layout>
      <Helmet>
        <title>{talk.title}</title>
      </Helmet>
      <SEO path={path} post={talkNode} />
      <Article className="talk">
        <header>
          <h1>{talk.title}</h1>
          {talk.date && <Time dateTime={new Date(talk.date)} />}
          {talk.location && (
            <p className="location">
              <EmojiText label="location of talk" emoji="📍">
                {talk.location}
              </EmojiText>
            </p>
          )}
        </header>
        {talkNode?.html && (
          <section dangerouslySetInnerHTML={{ __html: talkNode.html }} />
        )}
      </Article>
    </Layout>
  )
}

export default TalkTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TalkBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      timeToRead
      excerpt
      frontmatter {
        title
        cover {
          publicURL
        }
        date
        tags
        description
        location
      }
      fields {
        slug
        date
      }
      html
    }
  }
`
