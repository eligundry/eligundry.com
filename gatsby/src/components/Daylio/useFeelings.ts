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
  const entries = useStaticQuery<GatsbyTypes.UseFeelingsQuery>(graphql`
    query UseFeelings {
      allFeelings {
        feelings: nodes {
          time
          mood
          activities
          notes
        }
      }
    }
  `)

  return entries.allFeelings.feelings.map(entry => ({
    ...entry,
    time: parseISO(entry.time),
  }))
}
