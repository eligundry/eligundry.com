import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'

interface Feeling
  extends Omit<
    GatsbyTypes.UseFeelingsQuery['allFeelings']['feelings'][0],
    'time'
  > {
  time: Date
}

export default function useFeelings(): Feeling[] {
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
  }))
}
