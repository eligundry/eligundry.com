import { cacheAxios } from './axios'

export interface Feeling {
  time: string
  mood: string
  activities: string[]
  notes: string[]
}

export const getAll = async () =>
  cacheAxios
    .get<Feeling[]>('https://api.eligundry.com/api/feelings')
    .then((resp) => resp.data)

export const getLatest = async () => getAll().then((feelings) => feelings[0])

export const getCount = async (count: number) =>
  getAll().then((feelings) => feelings.slice(0, count))

export const getChartData = async (timeWindow: Date) =>
  getAll().then((feelings) =>
    feelings.map(({ time, mood }) => ({ x: time, y: mood }))
  )

export default { getAll, getLatest, getChartData }
