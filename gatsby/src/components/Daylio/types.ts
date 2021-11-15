import radPNG from '../../../static/img/feelings/rad.png'
import goodPNG from '../../../static/img/feelings/good.png'
import mehPNG from '../../../static/img/feelings/meh.png'
import badPNG from '../../../static/img/feelings/bad.png'
import awfulPNG from '../../../static/img/feelings/awful.png'

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

export const MoodImageMapping = Object.freeze({
  awful: awfulPNG,
  bad: badPNG,
  meh: mehPNG,
  good: goodPNG,
  rad: radPNG,
})

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
