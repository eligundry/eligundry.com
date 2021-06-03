import React from 'react'
import { PageProps } from 'gatsby'
import parseISO from 'date-fns/parseISO'

import Layout from '../layout'
import SEO from '../components/SEO'
import { DaylioList } from '../components/Daylio'
import useFeelingsImage from '../components/Daylio/useFeelingsImage'

const FeelingsPage: React.FC<PageProps> = props => {
  const feelingsImage = useFeelingsImage(
    props.location.hash
      ? parseISO(props.location.hash.replace('#', ''))
      : undefined
  )

  return (
    <Layout>
      <SEO
        path="feelings"
        title="Feelings"
        description="A log of my feelings"
        image={feelingsImage}
      />
      <DaylioList />
    </Layout>
  )
}

export default FeelingsPage
