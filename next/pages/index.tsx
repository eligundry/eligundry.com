import type { NextPage, GetStaticProps } from 'next'
import subMonths from 'date-fns/subMonths'

import Home, { HomeDataProps } from '@/components/Home'
import SEO from '@/components/SEO'
import DaylioProvider, {
  FullDaylioPageProps,
} from '@/components/Daylio/Provider'
import goodreads from '@/lib/goodreads'
import daylio from '@/lib/daylio'
import lastfm from '@/lib/lastfm'
import config from '@/utils/config'

const HomePage: NextPage<HomeDataProps & FullDaylioPageProps> = ({
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

export const getStaticProps: GetStaticProps<
  HomeDataProps & FullDaylioPageProps
> = async () => {
  const daylioChartData = await daylio.getChartData(subMonths(new Date(), 1))
  const latestDaylioEntry = await daylio.getLatest()
  const lastfmCover = await lastfm.getTopAlbumsCover('eli_pwnd')
  const reading = {
    current: await goodreads.getShelf(
      config.goodreadsUserID,
      'currently-reading',
      1
    ),
    read: await goodreads.getShelf(config.goodreadsUserID, 'read', 11),
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
