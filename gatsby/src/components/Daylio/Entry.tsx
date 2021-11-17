import React from 'react'
import formatISO from 'date-fns/formatISO'
import isEqual from 'lodash/isEqual'
import tw, { styled, css } from 'twin.macro'
import { Link } from 'gatsby'

import {
  DaylioEntry,
  DaylioVariants,
  MoodMapping,
  ActivityMapping,
} from './types'
import useFeelingsImage from './useFeelingsImage'
import Paper from '../Shared/Paper'

interface Props extends DaylioEntry {
  variant: DaylioVariants
  selected?: boolean
}

const EntryWrapper = styled.div<Partial<Props>>`
  ${tw`flex flex-row`}

  ${(props) => props.variant === DaylioVariants.home && tw`flex-row-reverse`}

  & .emoji-column {
    ${(props) =>
      props.variant === DaylioVariants.list
        ? css`
            display: inline-block;
            width: 4rem;
            vertical-align: top;
            line-height: 1;
            margin-right: 1em;
          `
        : tw`absolute`}

    & > * {
      display: block;
      width: 100%;
    }
  }

  & .text-column {
    display: inline-block;
    width: 100%;
    ${(props) =>
      props.variant === DaylioVariants.list &&
      css`
        max-width: calc(100% - 6rem);
      `}

    & h3 {
      font-size: 1.5em;
      margin-top: 0.2em;
      margin-bottom: 0.3em;
    }
  }

  & time {
    ${tw`font-sans text-base`}
  }

  ${(props) => props.variant === DaylioVariants.list && tw`my-4`}

  ${(props) =>
    props.selected &&
    css`
      & .text-column {
        ${tw`shadow-lg`}
      }
    `}
`

interface ActivityEmojiProps {
  dropShadow?: boolean
  home?: boolean
}

const Emoji = styled.span<ActivityEmojiProps>`
  font-size: 4rem;
  cursor: default;
  z-index: 9;
  position: relative;
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
  const feelingsImage = useFeelingsImage(time)
  const filteredActivities = activities.filter((a) => !!a && a.length > -1)
  const isoTime = formatISO(time)

  return (
    <EntryWrapper
      id={isoTime}
      variant={variant}
      selected={selected}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta content={feelingsImage} itemProp="image" />
      <link itemProp="author publisher" href="#eli-gundry" />
      <div className="emoji-column">
        <Emoji
          dropShadow={variant === DaylioVariants.list}
          title={`I felt ${mood}`}
          home={variant === DaylioVariants.home}
        >
          {MoodMapping[mood]}
        </Emoji>
      </div>
      <Paper
        className="text-column"
        transparent={variant === DaylioVariants.home}
        noPadding={variant === DaylioVariants.home}
      >
        <h3 itemProp="name headline">I felt {mood}</h3>
        <time dateTime={isoTime} itemProp="datePublished dateModified">
          <Link to={`/feelings#${isoTime}`} itemProp="url">
            {isoTime}
          </Link>
        </time>
        {filteredActivities.length > 0 && (
          <ActivitiesList>
            {filteredActivities.map((a) => (
              <ActivityEmoji
                key={`${time}-${a}`}
                data-tip={a}
                itemProp="keywords"
                content={`${ActivityMapping[a] ?? a} ${a}`}
                aria-label={a}
              >
                {ActivityMapping[a] || a}
              </ActivityEmoji>
            ))}
          </ActivitiesList>
        )}
        {notes &&
          (notes.length > 0 ? (
            <ul className="notes" itemProp="articleBody">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="note" itemProp="articleBody">
              {notes[0]}
            </p>
          ))}
      </Paper>
    </EntryWrapper>
  )
}

export default React.memo(Entry, isEqual)
