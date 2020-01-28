import React from 'react'
import useFetch from 'react-fetch-hook'

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
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error!</h1>
  }

  if (variant === 'home') {
    return <Entry {...data[0]} />
  }

  return (
    <>
      {data.map((entry: DaylioEntry) => (
        <Entry key={entry.time} {...entry} />
      ))}
    </>
  )
}

export default Daylio
