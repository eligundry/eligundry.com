import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'
import type Chart from 'chart.js'

import { MoodMapping } from './types'

export default function useFeelingsChartData(timeWindow: Date): Chart.ChartPoint[] {
  const entries = useStaticQuery<GatsbyTypes.UseFeelingsChartDataQuery>(graphql`
    query UseFeelingsChartData {
      allFeelings(limit: 100) {
        data: nodes {
          time
          mood
        }
      }
    }
  `)

  return entries.allFeelings.data
    .map(entry => ({ ...entry, time: parseISO(entry.time)  }))
    .filter(entry => entry.time >= timeWindow)
    .map(entry => ({
      x: entry.time,
      y: Object.keys(MoodMapping).findIndex(m => m === entry.mood),
  }))
}
