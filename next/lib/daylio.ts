import type { GetStaticProps } from 'next'
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import subMonths from 'date-fns/subMonths'
import promiseHash from 'promise-hash'

import { DaylioEntry, MoodMapping } from '@/components/Daylio/types'
import {
  LimitedDaylioPageProps,
  FullDaylioPageProps,
} from '@/components/Daylio/Provider'
import { cacheAxios } from './axios'

const getAll = async () =>
  cacheAxios
    .get<DaylioEntry<string>[]>('https://api.eligundry.com/api/feelings')
    .then((resp) => resp.data)

const getLatest = async () => getAll().then((feelings) => feelings[0])

const getRange = async (start: Date) =>
  getAll().then((feelings) =>
    feelings.filter(({ time }) => isAfter(parseISO(time), start))
  )

const getChartData = async (timeWindow: Date) =>
  getAll().then((feelings) =>
    feelings
      .map(({ time, mood }) => ({
        x: time,
        y: Object.keys(MoodMapping).findIndex((m) => m === mood),
      }))
      .filter(({ x }) => isAfter(parseISO(x), timeWindow))
  )

const getLimitedProps = async (): Promise<LimitedDaylioPageProps> => ({
  daylio: {
    entries: [await getLatest()],
  },
})

const getLimitedPageProps: GetStaticProps<
  LimitedDaylioPageProps
> = async () => ({
  props: await getLimitedProps(),
})

const getHomeProps = async () => ({
  entries: [await getLatest()],
  chartData: await getChartData(subMonths(new Date(), 1)),
})

const getFeelingsPageProps = async () =>
  promiseHash({
    entries: getRange(subMonths(new Date(), 6)),
    chartData: getChartData(subMonths(new Date(), 1)),
  })

export type { FullDaylioPageProps, LimitedDaylioPageProps }

const api = {
  getAll,
  getLatest,
  getChartData,
  getRange,
  getLimitedPageProps,
  getLimitedProps,
  getHomeProps,
  getFeelingsPageProps,
}

export default api
