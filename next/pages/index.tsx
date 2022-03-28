import type { NextPage, GetStaticProps } from 'next'
import subMonths from 'date-fns/subMonths'

import Home, { HomeDataProps } from '@/components/Home'
import SEO from '@/components/SEO'
import DaylioProvider, { DaylioState } from '@/components/Daylio/Provider'
import goodreads from '@/lib/goodreads'
import daylio from '@/lib/daylio'
import lastfm from '@/lib/lastfm'

const HomePage: NextPage<HomeDataProps & { daylio: DaylioState<string> }> = ({
  reading,
  lastfmCover,
  daylio,
}) => {
  return (
    <DaylioProvider {...daylio}>
      <SEO path="/" />
      <Home reading={reading} lastfmCover={lastfmCover} />
    </DaylioProvider>
  )
}

export const getStaticProps: GetStaticProps<HomeDataProps> = async () => {
  const daylioChartData = await daylio.getChartData(subMonths(new Date(), 1))
  const latestDaylioEntry = await daylio.getLatest()
  const lastfmCover = await lastfm.getTopAlbumsCover('eli_pwnd')
  const reading = {
    current: await goodreads.getShelf('29665939', 'currently-reading', 1),
    read: await goodreads.getShelf('29665939', 'read', 11),
  }

  return {
    props: {
      reading,
      lastfmCover,
      daylio: {
        entries: [latestDaylioEntry],
        chartData: daylioChartData,
      },
    },
  }
}

export default HomePage
