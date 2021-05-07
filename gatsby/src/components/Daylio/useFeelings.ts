import { useStaticQuery, graphql } from 'gatsby'
import parseISO from 'date-fns/parseISO'

import { DaylioEntry } from './types'

interface QueryResults {
  allFeelings: {
    feelings: DaylioEntry<string>[]
  }
}

export default function useFeelings(): DaylioEntry[] {
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
