import datesAreEqual from 'date-fns/isEqual'

import useFeelings from './useFeelings'
import radPNG from '../../../static/img/feelings/rad.png'
import goodPNG from '../../../static/img/feelings/good.png'
import mehPNG from '../../../static/img/feelings/meh.png'
import badPNG from '../../../static/img/feelings/bad.png'
import awfulPNG from '../../../static/img/feelings/awful.png'

export default function useFeelingsImage(targetDate?: Date): string {
  const entries = useFeelings()
  let { mood } = entries[0]

  if (targetDate) {
    const targetEntry = entries.find(entry =>
      datesAreEqual(entry.time, targetDate)
    )

    if (targetEntry) {
      mood = targetEntry.mood
    }
  }

  switch (mood) {
    case 'rad':
      return radPNG
    case 'good':
      return goodPNG
    case 'meh':
      return mehPNG
    case 'bad':
      return badPNG
    case 'awful':
      return awfulPNG
    default:
      return goodPNG
  }
}
