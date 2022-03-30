import type { GetStaticProps } from 'next'
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import { DaylioEntry } from '@/components/Daylio/types'
import {
  LimitedDaylioPageProps,
  FullDaylioPageProps,
} from '@/components/Daylio/Provider'
import { cacheAxios } from './axios'

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
      .map(({ time, mood }) => ({ x: time, y: mood }))
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

export type { FullDaylioPageProps, LimitedDaylioPageProps }

const api = {
  getAll,
  getLatest,
  getChartData,
  getRange,
  getLimitedPageProps,
  getLimitedProps,
}

export default api
