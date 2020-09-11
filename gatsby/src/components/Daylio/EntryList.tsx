import React, { useState, useLayoutEffect } from 'react'
import { useLocation } from 'react-use'
import tw, { styled } from 'twin.macro'

import Entry from './Entry'
import { DaylioEntry, DaylioVariants } from './types'

interface Props {
  entries: DaylioEntry[]
}

const bgColor = tw`text-pink-100`

const EntryListWrapper = styled.section`
  position: relative;

  &::before {
    content: ' ';
    position: absolute;
    margin-left: calc(2rem - 4px);
    height: 100%;
    z-index: 10;
    box-shadow: 0 0 0px 8px ${bgColor.color};
    margin-top: 5px;

    ${tw`border-4 border-pink-600 border-solid`}
  }
`

const EntryList: React.FC<Props> = ({ entries }) => {
  const { hash } = useLocation()
  const selectedEntryTime = hash ? hash.replace('#', '') : null
  const [hasScrolled, setHasScrolled] = useState(false)

  useLayoutEffect(() => {
    if (!hasScrolled && selectedEntryTime) {
      const targetEntry = document.getElementById(selectedEntryTime)

      if (targetEntry) {
        targetEntry.scrollIntoView({ behavior: 'smooth' })
        setHasScrolled(true)
      }
    }

    if (!window.location.hash) {
      setHasScrolled(true)
    }
  }, [hasScrolled, setHasScrolled, selectedEntryTime])

  return (
    <EntryListWrapper>
      {entries.map(entry => (
        <Entry
          key={entry.time}
          variant={DaylioVariants.list}
          selected={entry.time === selectedEntryTime}
          {...entry}
        />
      ))}
    </EntryListWrapper>
  )
}

export default EntryList
