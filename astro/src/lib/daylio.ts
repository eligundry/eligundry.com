import * as dateFns from 'date-fns'
import promiseHash from 'promise-hash'
import { cacheAxios } from './axios'

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
}

export interface DaylioEntry<TimeType = Date> {
  time: TimeType
  mood: keyof typeof MoodMapping
  activities: (keyof typeof ActivityMapping)[]
  notes: string[] | null
}

const getAll = async () =>
  cacheAxios
    .get<DaylioEntry<string>[]>('https://api.eligundry.com/api/feelings')
    .then((resp) => resp.data)

const getLatest = async () => getAll().then((feelings) => feelings[0])

const getRange = async (start: Date) =>
  getAll().then((feelings) =>
    feelings.filter(({ time }) =>
      dateFns.isAfter(dateFns.parseISO(time), start)
    )
  )

const getChartData = async (timeWindow: Date) =>
  getAll().then((feelings) =>
    feelings
      .map(({ time, mood }) => ({
        x: time,
        y: Object.keys(MoodMapping).findIndex((m) => m === mood),
      }))
      .filter(({ x }) => dateFns.isAfter(dateFns.parseISO(x), timeWindow))
      .sort((a, b) =>
        dateFns.compareAsc(dateFns.parseISO(a.x), dateFns.parseISO(b.x))
      )
  )

const getFaviconEmoji = async () =>
  getLatest().then((entry) => MoodMapping[entry.mood])

const getHomeProps = async () => ({
  entries: [await getLatest()],
  chartData: await getChartData(dateFns.subMonths(new Date(), 1)),
})

const getFeelingsPageProps = async () =>
  promiseHash({
    entries: getRange(dateFns.subMonths(new Date(), 6)),
    chartData: getChartData(dateFns.subMonths(new Date(), 1)),
  })

const api = {
  getAll,
  getLatest,
  getChartData,
  getRange,
  getHomeProps,
  getFeelingsPageProps,
  getFaviconEmoji,
}

export default api
