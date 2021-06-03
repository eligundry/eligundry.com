import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'

interface Feeling
  extends Omit<GatsbyTypes.UseLatestFeelingsQuery['feelings'], 'time'> {
  time: Date
}

export default function useLatestFeelings(): Feeling {
  const entry = useStaticQuery<GatsbyTypes.UseLatestFeelingsQuery>(
    graphql`
      query UseLatestFeelings {
        feelings {
          time
          mood
          activities
          notes
        }
      }
    `
  )

  return {
    ...entry.feelings,
    // @ts-ignore
    time: parseISO(entry.feelings.time),
  }
}
