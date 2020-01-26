import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import Home from '../components/Home'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Home />
    </Layout>
  )
}

export default HomePage
