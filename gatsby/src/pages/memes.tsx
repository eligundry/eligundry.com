import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import MemeListView from '../components/Memes/ListView'
import SEO from '../components/SEO'

const MemesPage: React.FC = () => (
  <Layout wider>
    <SEO
      path="memes"
      title="Memes"
      description="Memes that I do not own but find funny/interesting"
    >
      <link rel="preconnect" href="https://cdn.eligundry.com" />
    </SEO>
    <MemeListView />
  </Layout>
)

export default MemesPage
