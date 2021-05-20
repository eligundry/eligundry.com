import React from 'react'
import formatISO from 'date-fns/formatISO'

interface Props {
  time: Date
}

const Time: React.FC<Props> = ({ time }) => (
  <time>
    <span role="img" aria-label="calendar for the date">
      🗓
    </span>
    {formatISO(time, { representation: 'date' })}
  </time>
)

export default Time
