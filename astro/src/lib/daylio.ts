import dateFns from 'date-fns'
import { cacheAxios } from './cache'
import { MoodMapping, ActivityMapping } from './enums'

const getAll = async (): Promise<DaylioEntry[]> =>
  cacheAxios
    .get<RawDaylioEntry<string>[]>('https://api.eligundry.com/api/feelings')
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

const getChartData = async (timeWindow: Date): Promise<DaylioChartEntry[]> =>
  getAll().then((feelings) =>
    feelings
      .filter((entry) => dateFns.isAfter(entry.time, timeWindow))
      .sort((a, b) => dateFns.compareAsc(a.time, b.time))
      .map(({ rawTime, mood }) => ({
        x: rawTime,
        y: Object.keys(MoodMapping).findIndex((m) => m === mood),
      }))
  )

export interface RawDaylioEntry<TimeType = Date> {
  time: TimeType
  mood: keyof typeof MoodMapping
  activities: (keyof typeof ActivityMapping)[]
  notes: string[] | null
}

export interface DaylioEntry extends RawDaylioEntry<Date> {
  rawTime: string
  emoji: MoodMapping
}

export interface DaylioChartEntry {
  x: string
  y: number
}

const api = { getAll, getLatest, getRange, getChartData }

export default api
