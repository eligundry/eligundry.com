import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import formatISO from 'date-fns/formatISO'

import Layout from '../layout'
import UserInfo from '../components/UserInfo/UserInfo'
import PostTags from '../components/PostTags/PostTags'
import SocialLinks from '../components/SocialLinks/SocialLinks'
import SEO from '../components/SEO/SEO'
import Footer from '../components/Footer/Footer'
import config from '../../data/SiteConfig'
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
            {formatISO(new Date(talk.date), { representation: 'date' })}
          </time>
        </header>
        <section dangerouslySetInnerHTML={{ __html: talkNode.html }} />
        <UserInfo config={config} />
        <Footer config={config} />
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
      }
      fields {
        slug
        date
      }
    }
  }
`
