import React from 'react'
import formatISO from 'date-fns/formatISO'
import isEqual from 'lodash/isEqual'
import tw, { styled, css } from 'twin.macro'

import styleVariables from '../../../data/styleConfig'
import { PaperStyles } from '../Shared/Paper'
import {
  DaylioEntry,
  DaylioVariants,
  MoodMapping,
  ActivityMapping,
} from './types'

interface Props extends DaylioEntry {
  variant: DaylioVariants
  selected?: boolean
}

const EntryWrapper = styled.div<Partial<Props>>`
  display: block;

  ${props =>
    props.variant === DaylioVariants.home &&
    css`
      @media (${styleVariables.breakPoints.mobile}) {
        max-width: 100%;
      }
    `}

  & .emoji-column {
    display: inline-block;
    width: 4rem;
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
    width: 100%;
    max-width: calc(100% - 7rem);

    & h3 {
      font-size: 1.5em;
      margin-top: 0.2em;
      margin-bottom: 0.3em;
    }

    ${props =>
      props.variant === DaylioVariants.list &&
      css`
        @media (${styleVariables.breakPoints.mobile}) {
          padding-left: 1.8rem;
          z-index: 100;
          position: relative;
        }
      `}
  }

  & .notes {
    margin-top: 0;
    padding-left: 0;
  }

  ${props =>
    props.variant === DaylioVariants.list &&
    css`
      ${tw`my-4`}

      & .text-column {
        ${PaperStyles}
      }
    `}

  ${props =>
    props.selected &&
    css`
      & .text-column {
        ${tw`shadow-lg`}
      }
    `}
`

interface ActivityEmojiProps {
  dropShadow?: boolean
}

const bgColor = tw`text-pink-100`

const Emoji = styled.span<ActivityEmojiProps>`
  font-size: 4rem;
  cursor: default;
  z-index: 100;
  position: relative;

  ${props =>
    props.dropShadow &&
    css`
      text-shadow: 0px 8px 0px ${bgColor.color}, 0 -8px 0px ${bgColor.color};
    `}
`

const ActivitiesList = styled.ul`
  padding-left: 0 !important;
`

const ActivityEmoji = styled.li`
  display: inline;
  font-size: 2rem;
  cursor: default;
`

const Entry: React.FC<Props> = ({
  time,
  mood,
  activities,
  notes,
  variant,
  selected = false,
}) => {
  const filteredActivities = activities.filter(a => !!a && a.length > -1)

  return (
    <EntryWrapper id={time} variant={variant} selected={selected}>
      <div className="emoji-column">
        <Emoji
          dropShadow={variant === DaylioVariants.list}
          title={`I felt ${mood}`}
        >
          {MoodMapping[mood]}
        </Emoji>
      </div>
      <div className="text-column">
        <h3>I felt {mood}</h3>
        <time dateTime={time}>
          <a href={`/feelings#${time}`}>{formatISO(new Date(time))}</a>
        </time>
        {filteredActivities.length > 0 && (
          <ActivitiesList>
            {filteredActivities.map(a => (
              <ActivityEmoji key={`${time}-${a}`} data-tip={a}>
                {ActivityMapping[a] || a}
              </ActivityEmoji>
            ))}
          </ActivitiesList>
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

export default React.memo(Entry, isEqual)
