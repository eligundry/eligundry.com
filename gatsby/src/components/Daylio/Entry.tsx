import React from 'react'
import styled, { css } from 'styled-components'
/* import format from 'date-fns/format' */
import formatISO from 'date-fns/formatISO'

import { DaylioEntry, DaylioVariants } from './types'

interface Props extends DaylioEntry {
  variant: DaylioVariants
}

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
  museum: '🏛',
  party: '🎉',
  cleaning: '🧹',
}

const EntryWrapper = styled.div<Partial<Props>>`
  display: block;
  max-width: calc(100% - 7rem);

  & .emoji-column {
    display: inline-block;
    width: 5rem;
    vertical-align: top;
    line-height: 1;
    margin-right: 1em;

    & > * {
      display: block;
      width: 100%;
    }
  }

  & .text-column {
    display: inline-block;

    & h3 {
      font-size: 1.5em;
      margin-top: 0.2em;
      margin-bottom: 0.3em;
    }
  }

  & .activities {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  & .notes {
    margin-top: 0;
    padding-left: 0;
  }

  ${props =>
    props.variant === DaylioVariants.list &&
    css`
      margin: 1em 0;
    `}
`

const Emoji = styled.span`
  font-size: 5rem;
  cursor: default;
`

const ActivityEmoji = styled.li`
  display: inline;
  font-size: 2rem;
  cursor: default;
`

const Entry: React.FC<Props> = ({ time, mood, activities, notes, variant }) => {
  const filteredActivities = activities.filter(a => !!a && a.length > -1)

  return (
    <EntryWrapper id={time} variant={variant}>
      <div className="emoji-column">
        <Emoji title={`I felt ${mood}`}>{MoodMapping[mood]}</Emoji>
      </div>
      <div className="text-column">
        <h3>I felt {mood}</h3>
        <time dateTime={time}>
          <a href={`/feelings#${time}`}>
            {formatISO(new Date(time), 'MMMM do, yyyy @ HH:mm')}
          </a>
        </time>
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
