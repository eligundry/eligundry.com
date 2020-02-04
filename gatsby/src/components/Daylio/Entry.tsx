import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'

import { DaylioEntry } from './types'

const MoodMapping = {
  awful: '😖',
  bad: '😣',
  meh: '😕',
  good: '😀',
  rad: '🥳',
}

const ActivityMapping = {
  cook: '🧑‍🍳',
  movies: '🍿',
  relax: '💆‍♂️',
  'side-project': '👨‍💻',
}

const EntryWrapper = styled.div`
  display: block;

  & > * {
    display: block;
    width: 100%;
  }

  & .activities {
    list-style: none;
    padding-left: 0;

    li {
      display: inline;
      font-size: 3rem;
    }
  }
`

const Emoji = styled.span`
  font-size: 9rem;
`

const Entry: React.FC<DaylioEntry> = ({ time, mood, activities, notes }) => {
  const filteredActivities = activities.filter(a => !!a && a.length > -1)

  return (
    <EntryWrapper id={time}>
      <time dateTime={time}>
        <a href={`#${time}`}>
          {format(new Date(time), 'MMMM do, yyyy @ HH:mm')}
        </a>
      </time>
      <Emoji title={`I felt ${mood}`}>{MoodMapping[mood]}</Emoji>
      <h3>I felt {mood}</h3>
      {filteredActivities && (
        <ul className="activities">
          {filteredActivities.map((a, i) => (
            <li key={i} title={a}>
              {ActivityMapping[a] || a}
            </li>
          ))}
        </ul>
      )}
      {notes &&
        (notes.length > 1 ? (
          <ul className="notes">
            {notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        ) : (
          <p className="note">{notes[0]}</p>
        ))}
    </EntryWrapper>
  )
}

export default Entry
