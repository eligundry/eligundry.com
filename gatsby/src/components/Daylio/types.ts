export interface DaylioEntry {
  time: string
  mood: 'awful' | 'bad' | 'meh' | 'good' | 'rad'
  activities: string[]
  notes: string[] | null
}

export enum DaylioVariants {
  home = 'home',
  list = 'list',
}
