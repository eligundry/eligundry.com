import type { GetStaticProps } from 'next'
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import subMonths from 'date-fns/subMonths'
import { DaylioEntry, MoodMapping } from '@/components/Daylio/types'
import {
  LimitedDaylioPageProps,
  FullDaylioPageProps,
} from '@/components/Daylio/Provider'
import { cacheAxios } from './axios'
import promiseHash from 'promise-hash'

export const getAll = async () =>
  cacheAxios
    .get<DaylioEntry<string>[]>('https://api.eligundry.com/api/feelings')
    .then((resp) => resp.data)

export const getLatest = async () => getAll().then((feelings) => feelings[0])

export const getRange = async (start: Date) =>
  getAll().then((feelings) =>
    feelings.filter(({ time }) => isAfter(parseISO(time), start))
  )

export const getCount = async (count: number) =>
  getAll().then((feelings) => feelings.slice(0, count))

export const getChartData = async (timeWindow: Date) =>
  getAll().then((feelings) =>
    feelings
      .map(({ time, mood }) => ({
        x: time,
        y: Object.keys(MoodMapping).findIndex((m) => m === mood),
      }))
      .filter(({ x }) => isAfter(parseISO(x), timeWindow))
  )

export const getLimitedProps = async (): Promise<LimitedDaylioPageProps> => ({
  daylio: {
    entries: [await getLatest()],
  },
})

export const getLimitedPageProps: GetStaticProps<
  LimitedDaylioPageProps
> = async () => ({
  props: await getLimitedProps(),
})

export const getHomeProps = async () => ({
  entries: [await getLatest()],
  chartData: await getChartData(subMonths(new Date(), 1)),
})

export const getFeelingsPageProps = async () =>
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
