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

export default { getAll, getLatest }
