import React from 'react'
import ReactTooltip from 'react-tooltip'
import tw, { styled, css } from 'twin.macro'

import Entry from './Entry'
import EntryList from './EntryList'
import Tooltip from '../Shared/Tooltip'
import { DaylioVariants } from './types'
import useFeelings from './useFeelings'
import useLatestFeelings from './useLatestFeelings'

const Daylio: React.FC = () => {
  const entry = useLatestFeelings()

  return (
    <>
      <Tooltip />
      <Entry variant={DaylioVariants.home} {...entry} />
    </>
  )
}

export const DaylioList: React.FC = () => {
  const entries = useFeelings()

  return (
    <>
      <Tooltip />
      <EntryList entries={entries} />
    </>
  )
}

export default Daylio
