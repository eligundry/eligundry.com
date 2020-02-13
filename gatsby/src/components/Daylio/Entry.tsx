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
  work: '💼',
  friends: '👯‍♂️',
  sport: '🏃‍♂️',
  date: '👫',
  WFH: '🏚',
  reading: '📚',
  shopping: '🛒',
  'good meal': '🍜',
}

const EntryWrapper = styled.div`
  display: block;

  & .emoji-column {
    display: inline-block;
    width: 20%;
    text-align: center;

    & > * {
      display: block;
      width: 100%;
    }
  }

  & .text-column {
    display: inline-block;
    width: 80%;
    vertical-align: top;

    & h3 {
      margin-top: 0;
    }
  }

  & .activities {
    list-style: none;
    padding-left: 0;
  }

  & .emoji-column::after {
    content: ' ';
    border: 10px solid black;
    height: 30px;
    display: block;
    width: 5px;
    background-color: black;
    margin: -14px auto 7px 45%;
  }
`

const Emoji = styled.span`
  font-size: 9rem;
`

const ActivityEmoji = styled.li`
  display: inline;
  font-size: 3rem;
`

const Entry: React.FC<DaylioEntry> = ({ time, mood, activities, notes }) => {
  const filteredActivities = activities.filter(a => !!a && a.length > -1)

  return (
    <EntryWrapper id={time}>
      <div className="emoji-column">
        <time dateTime={time}>
          <a href={`#${time}`}>
            {format(new Date(time), 'MMMM do, yyyy @ HH:mm')}
          </a>
        </time>
        <Emoji title={`I felt ${mood}`}>{MoodMapping[mood]}</Emoji>
      </div>
      <div className="text-column">
        <h3>I felt {mood}</h3>
        {filteredActivities.length > 0 && (
          <ul className="activities">
            {filteredActivities.map(a => (
              <ActivityEmoji key={`${time}-${a}`} data-tip={a}>
                {ActivityMapping[a] || a}
              </ActivityEmoji>
            ))}
          </ul>
        )}
        {notes &&
          (notes.length > 0 ? (
            <ul className="notes">
              {notes.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="note">{notes[0]}</p>
          ))}
      </div>
    </EntryWrapper>
  )
}

export default Entry
