import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import MemeListView from '../components/Memes/ListView'

const MemesPage: React.FC = () => (
  <Layout wider>
    <Helmet>
      <title>Memes</title>
    </Helmet>
    <MemeListView />
  </Layout>
)

export default MemesPage
