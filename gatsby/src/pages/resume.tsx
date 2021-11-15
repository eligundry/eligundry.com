import React from 'react'

import Layout from '../layout'
import Resume from '../components/Resume'
import SEO from '../components/SEO'
import useIsPrinting from '../components/Shared/useIsPrinting'

const ResumePage: React.FC = () => {
  const isPrinting = useIsPrinting()

  return (
    <Layout hideHeader={isPrinting}>
      <SEO path="resume" title="Resume" description="My resume in HTML form" />
      <Resume />
    </Layout>
  )
}

export default ResumePage
