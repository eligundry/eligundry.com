import React from 'react'
import Helmet from 'react-helmet'

import Layout from 'src/layout'
import Home from 'src/components/Home'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Helmet title="Eli Gundry" titleTemplate="%s" />
      <Home />
    </Layout>
  )
}

export default HomePage
