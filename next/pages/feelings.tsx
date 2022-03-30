import type { NextPage, GetStaticProps } from 'next'
import subMonths from 'date-fns/subMonths'
import Link from 'next/link'

import SEO from '@/components/SEO'
import { DaylioList } from '@/components/Daylio'
import DaylioProvider from '@/components/Daylio/Provider'
import DaylioChart from '@/components/Daylio/Chart'
import Paper from '@/components/Shared/Paper'
import daylio, { FullDaylioPageProps } from '@/lib/daylio'
import { generateDaylioFeed } from '@/lib/feed'

const FeelingsPage: NextPage<FullDaylioPageProps> = ({ daylio }) => {
  return (
    <DaylioProvider {...daylio}>
      <SEO
        path="/feelings"
        title="Feelings"
        description="A log of my feelings. This really more of public diary. It's wild how long I've kept this going."
      />
      <Paper>
        <h1>Feelings</h1>
        <p>
          I maintain a diary of my feelings using{' '}
          <a href="https://daylio.net/">Daylio</a> which I publish to this site
          daily. I{' '}
          <Link href="/blog/feelings-api">
            <a>wrote a bit about it on my blog</a>
          </Link>
          , if you are interested in how and why.
        </p>
        <DaylioChart months={1} />
      </Paper>
      <DaylioList />
    </DaylioProvider>
  )
}

export const getStaticProps: GetStaticProps<FullDaylioPageProps> = async () => {
  generateDaylioFeed()

  return {
    props: {
      daylio: await daylio.getFeelingsPageProps(),
    },
  }
}

export default FeelingsPage
