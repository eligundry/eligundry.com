import React from 'react'
import styled from 'styled-components'

import { DaylioEntry } from './types'

const MoodMapping = {
  awful: '😖',
  bad: '😣',
  meh: '😕',
  good: '😀',
  rad: '🥳',
}

const Emoji = styled.span`
  font-size: 9rem;
`

const Entry: React.FC<DaylioEntry> = ({ time, mood, activities, notes }) => {
  const filteredActivities = activities.filter(a => !!a && a.length > 0)

  return (
    <div>
      <Emoji>{MoodMapping[mood]}</Emoji>
      <time dateTime={time}>{time}</time>
      {filteredActivities && (
        <ul>
          {filteredActivities.map(a => (
            <li>{a}</li>
          ))}
        </ul>
      )}
      {notes &&
        (notes.length > 1 ? (
          <ul>
            {notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        ) : (
          <p>{notes[0]}</p>
        ))}
    </div>
  )
}

export default Entry
