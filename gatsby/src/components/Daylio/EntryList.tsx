import React, { useState, useLayoutEffect } from 'react'
import { useLocation } from 'react-use'
import styled from 'styled-components'

import Entry from './Entry'
import { DaylioEntry, DaylioVariants } from './types'

interface Props {
  entries: DaylioEntry[]
}

const EntryListWrapper = styled.section`
  position: relative;

  &::before {
    content: ' ';
    border-left: 5px solid black;
    position: absolute;
    margin-left: calc(2rem - 3px);
    height: 100%;
    z-index: 10;
    box-shadow: 0 0 0px 8px white;
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
