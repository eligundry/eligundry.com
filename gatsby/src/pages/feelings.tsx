import React from 'react'
import parseISO from 'date-fns/parseISO'
import { Link, PageProps } from 'gatsby'

import Layout from '../layout'
import SEO from '../components/SEO'
import { DaylioList } from '../components/Daylio'
import useFeelingsImage from '../components/Daylio/useFeelingsImage'
import Paper from '../components/Shared/Paper'
import DaylioChart from '../components/Daylio/Chart'

const FeelingsPage: React.FC<PageProps> = (props) => {
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
      <Paper>
        <h1>Feelings</h1>
        <p>
          I maintain a diary of my feelings using{' '}
          <a href="https://daylio.net/">Daylio</a> which I publish to this site
          daily. I{' '}
          <Link to="/blog/feelings-api">wrote a bit about it on my blog</Link>,
          if you are interested in how and why.
        </p>
        <DaylioChart months={1} />
      </Paper>
      <DaylioList />
    </Layout>
  )
}

export default FeelingsPage
