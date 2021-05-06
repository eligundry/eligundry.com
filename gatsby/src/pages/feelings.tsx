import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import { DaylioList } from '../components/Daylio'

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
      <DaylioList />
    </Layout>
  )
}

export default FeelingsPage
