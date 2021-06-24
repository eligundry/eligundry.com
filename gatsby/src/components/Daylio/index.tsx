import React from 'react'
import ReactTooltip from 'react-tooltip'
import tw, { styled, css } from 'twin.macro'

import Entry from './Entry'
import EntryList from './EntryList'
import { DaylioVariants } from './types'
import useFeelings from './useFeelings'
import useLatestFeelings from './useLatestFeelings'

const Daylio: React.FC = () => {
  const entry = useLatestFeelings()

  return (
    <>
      <EntryTooltip />
      <Entry variant={DaylioVariants.home} {...entry} />
    </>
  )
}

export const DaylioList: React.FC = () => {
  const entries = useFeelings()

  return (
    <>
      <EntryTooltip />
      <EntryList entries={entries} />
    </>
  )
}

const EntryTooltip = styled(({ className }) => (
  <ReactTooltip
    place="top"
    effect="solid"
    border
    borderColor="rgb(226, 232, 240)"
    backgroundColor="white"
    textColor="black"
    className={className}
  />
))`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;

  &.show {
    opacity: 1;
  }
`

export default Daylio
