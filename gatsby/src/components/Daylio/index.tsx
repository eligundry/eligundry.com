import React from 'react'
import ReactTooltip from 'react-tooltip'

import Entry from './Entry'
import EntryList from './EntryList'
import { DaylioVariants } from './types'
import useFeelings from './useFeelings'
import useLatestFeelings from './useLatestFeelings'

const Daylio: React.FC = () => {
  const entry = useLatestFeelings()

  return (
    <>
      <ReactTooltip place="top" effect="solid" />
      <Entry variant={DaylioVariants.home} {...entry} />
    </>
  )
}

export const DaylioList: React.FC = () => {
  const entries = useFeelings()

  return (
    <>
      <ReactTooltip place="top" effect="solid" />
      <EntryList entries={entries} />
    </>
  )
}

export default Daylio
