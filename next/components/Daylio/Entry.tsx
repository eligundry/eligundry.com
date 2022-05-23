import React from 'react'
import formatISO from 'date-fns/formatISO'
import Link from 'next/link'
import clsx from 'clsx'

import Paper from '@/components/Shared/Paper'
import {
  DaylioEntry,
  DaylioVariants,
  MoodMapping,
  ActivityMapping,
} from './types'
import styles from './index.module.scss'

interface Props extends DaylioEntry {
  variant: DaylioVariants
  selected?: boolean
}

const Entry: React.FC<Props> = ({
  time,
  mood,
  activities,
  notes,
  variant,
  selected = false,
}) => {
  const filteredActivities =
    activities?.filter((a) => !!a && a.length > -1) ?? []
  const isoTime = formatISO(time ?? new Date())

  return (
    <article
      id={isoTime}
      className={clsx(
        styles.entryWrapper,
        variant === DaylioVariants.list
          ? styles.listEntryWrapper
          : styles.homeEntryWrapper
      )}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta
        content={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${MoodMapping[mood]}</text></svg>`}
        itemProp="image"
      />
      <link itemProp="author publisher" href="#eli-gundry" />
      <div
        className={clsx(
          styles.emojiColumn,
          variant === DaylioVariants.list
            ? styles.listEmojiColumn
            : styles.homeEmojiColumn
        )}
      >
        <span
          role="img"
          aria-label="emoji showing my general mood"
          title={`I felt ${mood}`}
          className={styles.emoji}
        >
          {MoodMapping[mood]}
        </span>
      </div>
      <Paper
        className={clsx(
          styles.textColumn,
          selected && styles.selectedTextColumn,
          variant === DaylioVariants.list && styles.listTextColumn
        )}
        transparent={variant === DaylioVariants.home}
        noPadding={variant === DaylioVariants.home}
      >
        <h3 itemProp="name headline">I felt {mood}</h3>
        <time dateTime={isoTime} itemProp="datePublished dateModified">
          <Link href={`/feelings#${isoTime}`}>
            <a itemProp="url">{isoTime}</a>
          </Link>
        </time>
        {filteredActivities.length > 0 && (
          <ul className={styles.activitiesList}>
            {filteredActivities.map((a) => (
              <li
                key={`${time}-${a}`}
                data-tip={a}
                itemProp="keywords"
                aria-label={a}
                className={styles.activityEmoji}
              >
                {ActivityMapping[a] || a}
              </li>
            ))}
          </ul>
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
    </article>
  )
}

export default Entry
