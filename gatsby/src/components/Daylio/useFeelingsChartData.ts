import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import dateCompareAsc from 'date-fns/compareAsc'

import { MoodMapping } from './types'

export default function useFeelingsChartData(timeWindow: Date) {
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
    .map(entry => ({
      x: parseISO(entry.time),
      y: Object.keys(MoodMapping).findIndex(m => m === entry.mood),
    }))
    .filter(entry => entry.x >= timeWindow)
    .sort((a, b) => dateCompareAsc(a.x, b.x))
    .map(entry => ({ ...entry, x: formatISO(entry.x) }))
}
