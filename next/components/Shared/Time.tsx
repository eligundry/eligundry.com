import React from 'react'
import formatISO from 'date-fns/formatISO'

import EmojiText from './EmojiText'

interface Props
  extends Omit<
    React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLElement>, HTMLElement>,
    'dateTime'
  > {
  dateTime: Date
}

const Time: React.FC<Props> = ({ dateTime, ...props }) => (
  <time dateTime={dateTime.toISOString()} {...props}>
    <EmojiText label="calendar for the date" emoji="🗓">
      {formatISO(dateTime, { representation: 'date' })}
    </EmojiText>
  </time>
)

export default Time
