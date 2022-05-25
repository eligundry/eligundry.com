import React from 'react'
import Calendar from 'react-activity-calendar'

import type { GitHubApiResponse } from '@/lib/github'
import Tooltip from '@/components/Shared/Tooltip'
import useTailwindTheme from '@/hooks/useTailwindTheme'
import { usePrefersDarkMode } from '@/components/Layout/ThemeModeProvider'

interface Props {
  data: GitHubApiResponse
}

// I lifted much of this from https://github.com/grubersjoe/react-github-calendar
// I really wanted to load the data during SSR and this was the best way to do it.

const GitHubCalendar: React.FC<Props> = ({ data }) => {
  const theme = useTailwindTheme()
  const darkMode = usePrefersDarkMode()

  return (
    <Calendar
      data={data.contributions}
      dateFormat="yyyy-MM-dd"
      labels={{
        totalCount: `{{count}} contributions in the last year`,
      }}
      theme={{
        level0: darkMode ? theme.colors.typographyDark : theme.colors.liteGray,
        level1: 'hsla(203, 93%, 45%, 0.44)',
        level2: 'hsla(203, 93%, 45%, 0.6)',
        level3: 'hsla(203, 93%, 45%, 0.76)',
        level4: 'hsla(203, 93%, 45%, 0.92)',
      }}
    >
      <Tooltip />
    </Calendar>
  )
}

export default GitHubCalendar
