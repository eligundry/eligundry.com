import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import Home from '../components/Home'
import SEO from '../components/SEO'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Helmet title="Eli Gundry" titleTemplate="%s" />
      <SEO path="" />
      <Home />
    </Layout>
  )
}

export default HomePage
