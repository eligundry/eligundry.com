import React from 'react'
import Helmet from 'react-helmet'

import Layout from '../layout'
import Resume from '../components/Resume'

const ResumePage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Resume</title>
      </Helmet>
      <Resume />
    </Layout>
  )
}

export default ResumePage
