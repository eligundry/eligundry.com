import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'

import { DaylioEntry } from './types'

interface QueryResults {
  feelings: DaylioEntry<string>
}

export default function useLatestFeelings(): DaylioEntry {
  const entry = useStaticQuery<QueryResults>(
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
    time: parseISO(entry.feelings.time),
  }
}
