/* eslint-disable no-shadow */
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
  concert = '🎸',
  'Broadway show' = '🎭',
}

export interface DaylioEntry<TimeType = Date> {
  time: TimeType
  mood: keyof typeof MoodMapping
  activities: (keyof typeof ActivityMapping)[]
  notes: string[] | null
}
