import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'
import { DaylioEntry } from './types'

export default function useLatestFeelings(): DaylioEntry {
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
  } as DaylioEntry
}
