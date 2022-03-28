import React from 'react'

import Entry from './Entry'
import EntryList from './EntryList'
import { DaylioVariants } from './types'
import { useFeelings, useLatestFeelings } from './hooks'

const Daylio: React.FC = () => {
  const entry = useLatestFeelings()

  return <Entry variant={DaylioVariants.home} {...entry} />
}

export const DaylioList: React.FC = () => {
  const entries = useFeelings()

  return <EntryList entries={entries} />
}

export default Daylio
