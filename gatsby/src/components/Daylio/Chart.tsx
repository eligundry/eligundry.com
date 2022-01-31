import React, { useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import subMonths from 'date-fns/subMonths'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import type { CoreChartOptions, ChartType } from 'chart.js/types/index.esm'
import 'chartjs-adapter-date-fns'
import { navigate } from 'gatsby'
import { theme } from 'twin.macro'

import useFeelingsChartData from './useFeelingsChartData'
import { MoodMapping } from './types'
import { useHasTouch } from '../../utils/useIsMobile'
import { usePrefersDarkMode } from '../../layout/ThemeModeProvider'
import { toolTipTheme } from '../../utils/charts'

interface Props {
  months?: number
}

const DaylioChart: React.FC<Props> = ({ months = 1 }) => {
  const timeWindow = subMonths(new Date(), months)
  const data = useFeelingsChartData(timeWindow)
  const isTouchScreen = useHasTouch()
  const prefersDark = usePrefersDarkMode()

  // Clicking on an entry will navigate to the entry on the feelings page
  const handlePointClick = useCallback<CoreChartOptions<ChartType>['onClick']>(
    (_, points) => {
      if (!points?.length) {
        return
      }

      const targetEntry = data[points[0].index]

      if (!targetEntry) {
        return
      }

      navigate(`/feelings#${targetEntry.x}`)
    },
    [data]
  )

  // Hovering on a point will change cursor to denote that it is a link
  const handlePointHover = useCallback<CoreChartOptions<ChartType>['onHover']>(
    (event, points) => {
      if (event.native?.target?.style) {
        event.native.target.style.cursor = points.length ? 'pointer' : 'default'
      }
    },
    []
  )

  return (
    <div style={{ minHeight: '153px' }}>
      <Line
        type="line"
        height={60}
        data={{
          labels: Object.values(MoodMapping).map((_, i) => i),
          datasets: [
            {
              data,
              backgroundColor: 'transparent',
              pointStyle: 'rect',
              borderColor: theme`colors.primaryLite`,
              pointBorderColor: theme`colors.primary`,
              pointBackgroundColor: theme`colors.primary`,
              radius: 5,
            },
          ],
        }}
        options={{
          events: isTouchScreen
            ? []
            : ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
          onClick: handlePointClick,
          onHover: handlePointHover,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              ...toolTipTheme(prefersDark),
              callbacks: {
                title: (item, _) =>
                  `📅   ${formatISO(parseISO(item[0].raw.x))}`,
                // @ts-ignore
                label: (item, _) =>
                  `${Object.values(MoodMapping)[item.raw.y]}  I felt ${
                    Object.keys(MoodMapping)[item.raw.y]
                  }`,
              },
            },
          },
          scales: {
            x: {
              min: timeWindow,
              ticks: {
                callback: () => null,
              },
            },
            y: {
              min: 0,
              grid: {
                color: prefersDark ? theme`colors.typographyLite` : undefined,
              },
              ticks: {
                // @ts-ignore
                callback: (value) => Object.values(MoodMapping)[value],
                font: {
                  size: 20,
                },
              },
            },
          },
        }}
      />
    </div>
  )
}

export default DaylioChart
