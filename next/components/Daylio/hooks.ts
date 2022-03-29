import { useContext } from 'react'
import { DaylioContext } from './Provider'
import { MoodMapping } from './types'

export function useDaylio() {
  return useContext(DaylioContext)
}

export function useFeelings() {
  return useDaylio().entries
}

export function useFeelingsChartData() {
  return useDaylio().chartData
}

export function useLatestFeelings() {
  return useDaylio().entries?.[0] ?? null
}

export function useLatestEmoji() {
  return MoodMapping[useLatestFeelings()?.mood ?? 'rad']
}
