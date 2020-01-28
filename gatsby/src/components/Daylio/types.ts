interface DaylioEntry {
  time: string
  mood: 'awful' | 'bad' | 'meh' | 'good' | 'rad'
  activities: string[]
  notes: string[] | null
}
