import React from 'react'
import { useQuery } from 'react-query'
import ReactTooltip from 'react-tooltip'

import Entry from './Entry'
import EntryList from './EntryList'
import { DaylioEntry, DaylioVariants } from './types'
import customFetch, { processResponse } from '../../utils/fetch'

interface Props {
  variant?: DaylioVariants
}

const Daylio: React.FC<Props> = ({ variant = DaylioVariants.home }) => {
  const { isFetching, error, data: entries } = useQuery(
    ['feelings', variant],
    () =>
      customFetch(
        `/api/feelings${variant === 'home' ? '/time/today' : ''}`
      ).then(res => processResponse<DaylioEntry[]>(res))
  )

  if (isFetching && !entries) {
    return <h1>Loading Eli's Feelings...</h1>
  }

  if (error) {
    return <h1>Error!</h1>
  }

  const tooltip = <ReactTooltip place="top" effect="solid" />

  if (variant === DaylioVariants.home) {
    return (
      <>
        {tooltip}
        <Entry variant={DaylioVariants.home} {...entries[0]} />
      </>
    )
  }

  return (
    <>
      {tooltip}
      <EntryList entries={entries} />
    </>
  )
}

export default Daylio
