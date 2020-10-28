import { useQuery } from 'react-query'

import { DaylioEntry, DaylioVariants } from './types'
import customFetch, { processResponse } from '../../utils/fetch'

export default function useFeelings(variant = DaylioVariants.list) {
  const { isFetching, error, data: entries } = useQuery(
    ['feelings', variant],
    () =>
      customFetch(
        `/api/feelings${variant === 'home' ? '/time/today' : ''}`
      ).then(res => processResponse<DaylioEntry[]>(res))
  )

  return { isFetching, error, entries }
}
