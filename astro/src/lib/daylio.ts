import dateFns from 'date-fns'
import { cacheAxios } from './cache'

const getAll = async () =>
  cacheAxios
    .get<DaylioEntry<string>[]>('https://api.eligundry.com/api/feelings')
    .then((resp) =>
      resp.data.map((entry) => ({
        ...entry,
        emoji: MoodMapping[entry.mood],
        time: dateFns.parseISO(entry.time),
        rawTime: entry.time,
      }))
    )
    .catch((error) => {
      console.error('could not catch feelings', error)
      throw error
    })

const getLatest = async () => getAll().then((feelings) => feelings[0])

const getRange = async (start: Date) =>
  getAll().then((feelings) =>
    feelings.filter(({ time }) => dateFns.isAfter(time, start))
  )

export enum DaylioVariants {
  home = 'home',
  list = 'list',
}

export enum MoodMapping {
  awful = '😖',
  bad = '😣',
  meh = '😕',
  good = '😀',
  rad = '🥳',
}

export enum ActivityMapping {
  cook = '🧑‍🍳',
  movies = '🍿',
  movie = '🍿',
  relax = '💆‍♂️',
  'side-project' = '👨‍💻',
  work = '💼',
  friends = '👯‍♂️',
  sport = '🏃‍♂️',
  date = '👫',
  WFH = '🏚',
  reading = '📚',
  shopping = '🛒',
  'good meal' = '🍜',
  museum = '🏛',
  party = '🎉',
  cleaning = '🧹',
  gaming = '🕹',
  'binging tv' = '📺',
  'ate meat' = '🥩',
  'no meat' = '🌿',
  travel = '✈️',
  'went outside' = '🌞',
  delivery = '🥡',
  concert = '🎶',
  'Broadway show' = '🎭',
  guitar = '🎸',
}

export interface DaylioEntry<TimeType = Date> {
  time: TimeType
  mood: keyof typeof MoodMapping
  activities: (keyof typeof ActivityMapping)[]
  notes: string[] | null
}

const api = { getAll, getLatest, getRange }

export default api
