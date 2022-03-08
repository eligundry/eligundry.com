import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'
import { DaylioEntry } from './types'

export default function useLatestFeelings(): DaylioEntry {
  const entry = useStaticQuery<GatsbyTypes.UseLatestFeelingsQuery>(
    graphql`
      query UseLatestFeelings {
        feeling {
          time
          mood
          activities
          notes
        }
      }
    `
  )

  return {
    ...entry.feeling,
    // @ts-ignore
    time: parseISO(entry.feeling.time),
  } as DaylioEntry
}
