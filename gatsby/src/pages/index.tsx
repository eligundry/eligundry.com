import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import Home from '../components/Home'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Helmet title="Eli Gundry" titleTemplate="%s" />
      <Home />
    </Layout>
  )
}

export default HomePage
