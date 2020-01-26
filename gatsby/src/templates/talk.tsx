import React from 'react'
import Helmet from 'react-helmet'

import Talk from '../components/Talk/index'

interface TalkProps {
  pageContext: {
    title: string
    slug: string
    date: string
    rawMarkdownBody: string
  }
}

const TalkTemplate: React.FC<TalkProps> = ({ pageContext }) => {
  const { title, date, rawMarkdownBody } = pageContext

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Talk slideHTML={rawMarkdownBody} />
    </>
  )
}

export default TalkTemplate
