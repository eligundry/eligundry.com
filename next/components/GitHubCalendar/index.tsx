import React from 'react'
import Calendar from 'react-activity-calendar'
import { theme } from 'twin.macro'

import type { GitHubApiResponse } from '@/lib/github'
import Tooltip from '@/components/Shared/Tooltip'

interface Props {
  data: GitHubApiResponse
}

// I lifted much of this from https://github.com/grubersjoe/react-github-calendar
// I really wanted to load the data during SSR and this was the best way to do it.

const GitHubCalendar: React.FC<Props> = ({ data }) => (
  <Calendar
    data={data.contributions}
    color={theme`colors.primary`}
    dateFormat="yyyy-MM-dd"
    hideColorLegend
    labels={{
      totalCount: `{{count}} contributions in the last year`,
    }}
  >
    <Tooltip html />
  </Calendar>
)

export default GitHubCalendar
