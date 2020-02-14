import React from 'react'
import useFetch from 'react-fetch-hook'
import ReactTooltip from 'react-tooltip'

import Entry from './Entry'
import { DaylioEntry, DaylioVariants } from './types'

interface Props {
  variant?: DaylioVariants
}

const Daylio: React.FC<Props> = ({ variant = DaylioVariants.home }) => {
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
      {data.map((entry: DaylioEntry) => (
        <Entry key={entry.time} variant={DaylioVariants.list} {...entry} />
      ))}
    </>
  )
}

export default Daylio
