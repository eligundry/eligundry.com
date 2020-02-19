import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import Daylio from '../components/Daylio'

const FeelingsPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Feelings</title>
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/api/feelings/feed.rss"
        />
      </Helmet>
      <Daylio variant="list" />
    </Layout>
  )
}

export default FeelingsPage
