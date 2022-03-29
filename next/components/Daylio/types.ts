/* eslint-disable no-shadow */
// import radPNG from '@/img/feelings/rad.png'
// import goodPNG from '@/img/feelings/good.png'
// import mehPNG from '@/img/feelings/meh.png'
// import badPNG from '@/img/feelings/bad.png'
// import awfulPNG from '@/img/feelings/awful.png'

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
