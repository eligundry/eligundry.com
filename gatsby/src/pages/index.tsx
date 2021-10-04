import React from 'react'
import Helmet from 'react-helmet'
import { PageProps } from 'gatsby'

import Layout from '../layout'
import Styles from '../layout/Styles'
import Home from '../components/Home'
import SEO from '../components/SEO'

const HomePage: React.FC<PageProps> = () => {
  return (
    <React.Fragment>
      <Helmet title="Eli Gundry" titleTemplate="%s" />
      <SEO path="" />
      <Styles />
      <Home />
    </React.Fragment>
  )
}

export default HomePage
