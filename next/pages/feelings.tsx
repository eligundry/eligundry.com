import type { NextPage, GetStaticProps } from 'next'
import subMonths from 'date-fns/subMonths'
import Link from 'next/link'

import { DaylioList } from '@/components/Daylio'
import DaylioProvider, { DaylioState } from '@/components/Daylio/Provider'
import DaylioChart from '@/components/Daylio/Chart'
import Paper from '@/components/Shared/Paper'
import daylio from '@/lib/daylio'

const FeelingsPage: NextPage<{ daylio: DaylioState<string> }> = ({
  daylio,
}) => {
  return (
    <DaylioProvider {...daylio}>
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

export const getStaticProps: GetStaticProps<{
  daylio: DaylioState<string>
}> = async () => {
  const entries = await daylio.getRange(subMonths(new Date(), 6))
  const chartData = await daylio.getChartData(subMonths(new Date(), 1))

  return {
    props: {
      daylio: {
        entries,
        chartData,
      },
    },
  }
}

export default FeelingsPage
