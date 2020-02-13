import React from 'react'
import useFetch from 'react-fetch-hook'
import ReactTooltip from 'react-tooltip'

import Entry from './Entry'
import { DaylioEntry } from './types'

interface Props {
  variant?: 'home' | 'list'
}

const Daylio: React.FC<Props> = ({ variant = 'home' }) => {
  const { loading, error, data } = useFetch<DaylioEntry>(
    variant === 'home' ? '/api/daylio/today' : '/api/daylio',
    {},
    []
  )

  if (loading || !data) {
    return <h1>Loading Eli's Feelings...</h1>
  }

  if (error) {
    return <h1>Error!</h1>
  }

  const tooltip = <ReactTooltip place="top" effect="solid" />

  if (variant === 'home') {
    return (
      <>
        {tooltip}
        <Entry {...data[0]} />
      </>
    )
  }

  return (
    <>
      {tooltip}
      {data.map((entry: DaylioEntry) => (
        <Entry key={entry.time} {...entry} />
      ))}
    </>
  )
}

export default Daylio
