import React from 'react'
import { useQuery } from 'react-query'
import ReactTooltip from 'react-tooltip'

import Entry from './Entry'
import EntryList from './EntryList'
import { DaylioEntry, DaylioVariants } from './types'

interface Props {
  variant?: DaylioVariants
}

const Daylio: React.FC<Props> = ({ variant = DaylioVariants.home }) => {
  const { isFetching, error, data } = useQuery<DaylioEntry[]>(
    ['feelings', variant],
    () =>
      fetch(`/api/feelings${variant === 'home' ? '/time/today' : ''}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Could not fetch feelings')
          }

          return res
        })
        .then(res => res.json())
  )

  if (isFetching && !data) {
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
        <Entry variant={DaylioVariants.home} {...data[0]} />
      </>
    )
  }

  return (
    <>
      {tooltip}
      <EntryList entries={data} />
    </>
  )
}

export default Daylio
