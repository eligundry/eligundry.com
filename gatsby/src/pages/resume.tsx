import React from 'react'

import Layout from '../layout'
import Resume from '../components/Resume'
import SEO from '../components/SEO'

const ResumePage: React.FC = () => {
  return (
    <Layout showFooter={false}>
      <SEO path="resume" title="Resume" description="My resume in HTML form" />
      <Resume />
    </Layout>
  )
}

export default ResumePage
