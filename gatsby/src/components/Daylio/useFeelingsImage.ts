import datesAreEqual from 'date-fns/isEqual'

import useFeelings from './useFeelings'
import useLatestFeelings from './useLatestFeelings'
import { MoodImageMapping } from './types'

export default function useFeelingsImage(targetDate?: Date): string {
  const entries = useFeelings()
  let { mood } = entries[0]

  if (targetDate) {
    const targetEntry = entries.find((entry) =>
      datesAreEqual(entry.time, targetDate)
    )

    if (targetEntry) {
      mood = targetEntry.mood
    }
  }

  return MoodImageMapping?.[mood] ?? MoodImageMapping.rad
}

export function useLatestFeelingsImage(): string {
  const entry = useLatestFeelings()
  return MoodImageMapping?.[entry.mood] ?? MoodImageMapping.rad
}
