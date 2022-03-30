import type { NextPage, GetStaticProps } from 'next'
import subMonths from 'date-fns/subMonths'
import promiseHash from 'promise-hash'

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
> = async () => ({
  props: await promiseHash({
    reading: promiseHash({
      current: goodreads.getShelf(
        config.goodreadsUserID,
        'currently-reading',
        1
      ),
      read: goodreads.getShelf(config.goodreadsUserID, 'read', 11),
    }),
    lastfmCover: lastfm.getTopAlbumsCover('eli_pwnd'),
    daylio: daylio.getHomeProps(),
  }),
})

export default HomePage
