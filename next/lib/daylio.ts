import axios from 'axios'

export interface Feeling {
  time: string
  mood: string
  activities: string[]
  notes: string[]
}

export const getAll = async () =>
  axios
    .get<Feeling[]>('https://api.eligundry.com/api/feelings')
    .then((resp) => resp.data)

export const getLatest = async () => getAll().then((feelings) => feelings[0])

export const getCount = async (count: number) =>
  getAll().then((feelings) => feelings.slice(0, count))

export const getChartData = async () =>
  getAll().then((feelings) =>
    feelings.slice(0, 100).map(({ time, mood }) => ({ time, mood }))
  )

export default { getAll, getLatest }
