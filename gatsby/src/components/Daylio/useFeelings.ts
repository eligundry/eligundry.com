import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'
import { DaylioEntry } from './types'

export default function useFeelings(): DaylioEntry[] {
  // Fetch the last 6 months of feelings, let things disappear over time
  const entries = useStaticQuery<GatsbyTypes.UseFeelingsQuery>(graphql`
    query UseFeelings {
      allFeelings(limit: 183) {
        feelings: nodes {
          time
          mood
          activities
          notes
        }
      }
    }
  `)

  return entries.allFeelings.feelings.map((entry) => ({
    ...entry,
    time: parseISO(entry.time),
  })) as DaylioEntry[]
}
