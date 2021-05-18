import React from 'react'

import Layout from '../layout'
import SEO from '../components/SEO'
import { DaylioList } from '../components/Daylio'

const FeelingsPage: React.FC = () => {
  return (
    <Layout>
      <SEO
        path="feelings"
        title="Feelings"
        description="A log of my feelings"
      />
      <DaylioList />
    </Layout>
  )
}

export default FeelingsPage
