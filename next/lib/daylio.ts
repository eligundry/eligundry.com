import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import { DaylioEntry } from '@/components/Daylio/types'
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

const api = { getAll, getLatest, getChartData, getRange }

export default api
