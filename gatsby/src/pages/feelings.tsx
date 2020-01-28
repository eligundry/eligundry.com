import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import Daylio from '../components/Daylio/functional'

const FeelingsPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Feelings</title>
      </Helmet>
      <Daylio variant="list" />
    </Layout>
  )
}

export default FeelingsPage
