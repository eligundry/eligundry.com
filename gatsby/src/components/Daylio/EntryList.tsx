import React, { useState, useLayoutEffect } from 'react'
import { useLocation } from 'react-use'
import styled from 'styled-components'

import Entry from './Entry'
import { DaylioEntry, DaylioVariants } from './types'

interface Props {
  entries: DaylioEntry[]
}

const EntryListWrapper = styled.main`
  &:before: {
    content: ' ';
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
