import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'
import { styled } from 'twin.macro'
import { MDXRenderer } from 'gatsby-plugin-mdx'

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
  const talkNode = data.mdx
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
      <Article
        className="talk"
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <link itemProp="author publisher" href="#eli-gundry" />
        {talkNode?.fields?.latestCommitDate && (
          <meta
            itemProp="dateModified"
            content={talkNode.fields.latestCommitDate}
          />
        )}
        <header>
          <h1 itemProp="name headline">{talk.title}</h1>
          {talk.date && (
            <Time itemProp="datePublished" dateTime={new Date(talk.date)} />
          )}
          {talk.location && (
            <p className="location">
              <EmojiText label="location of talk" emoji="📍">
                {talk.location}
              </EmojiText>
            </p>
          )}
        </header>
        {talkNode?.body && (
          <MDXRenderer itemProp="text">{talkNode.body}</MDXRenderer>
        )}
      </Article>
    </Layout>
  )
}

export default TalkTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TalkBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      timeToRead
      excerpt
      collection
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
        latestCommitDate
      }
      body
    }
  }
`
