import React from 'react'
import ReactTooltip from 'react-tooltip'

import Entry from './Entry'
import EntryList from './EntryList'
import { DaylioVariants } from './types'
import useFeelings from './useFeelings'

interface Props {
  variant?: DaylioVariants
}

const Daylio: React.FC<Props> = ({ variant = DaylioVariants.home }) => {
  const entries = useFeelings()

  if (!entries) {
    return <h1>Loading Eli's Feelings...</h1>
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
