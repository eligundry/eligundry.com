import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-use'

import Entry from './Entry'
import { DaylioEntry, DaylioVariants } from './types'
import styles from './index.module.scss'

interface Props {
  entries: DaylioEntry[]
}

const EntryList: React.FC<Props> = ({ entries }) => {
  const { hash } = useLocation()
  const selectedEntryTime = hash ? hash.replace('#', '') : null
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
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
    <section className={styles.entryListWrapper}>
      {entries.map((entry) => (
        <Entry
          key={entry.time.toISOString()}
          variant={DaylioVariants.list}
          selected={entry.time.toISOString() === selectedEntryTime}
          {...entry}
        />
      ))}
    </section>
  )
}

export default EntryList
