import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import About from '../components/About/About'

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="about-container">
        <Helmet>
          <title>About</title>
        </Helmet>
        <About />
      </div>
    </Layout>
  )
}

export default AboutPage
