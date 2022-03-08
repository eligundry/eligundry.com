import React from 'react'

import Layout from '../layout'
import Resume from '../components/Resume'
import SEO from '../components/SEO'
import useIsPrinting from '../components/Shared/useIsPrinting'

const ResumePage: React.FC = () => {
  const isPrinting = useIsPrinting()

  return (
    <Layout hideHeader={isPrinting}>
      <SEO
        path="resume"
        title="Resume"
        description="My resume in HTML form. Dang, I have worked at a lot of places, so many accomplishments. What a storied career I've had."
      />
      <Resume />
    </Layout>
  )
}

export default ResumePage
