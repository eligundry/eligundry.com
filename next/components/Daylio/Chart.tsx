import React, { useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import type { CoreChartOptions, ChartType } from 'chart.js/types/index.esm'
import 'chartjs-adapter-date-fns'
import { theme } from 'twin.macro'
import { useRouter } from 'next/router'

import { MoodMapping } from './types'
import { useHasTouch } from '../../utils/useIsMobile'
import { usePrefersDarkMode } from '@/components/Layout/ThemeModeProvider'
import { toolTipTheme } from '../../utils/charts'
import { useFeelingsChartData } from './hooks'

interface Props {
  months?: number
}

const DaylioChart: React.FC<Props> = () => {
  const data = useFeelingsChartData()
  const isTouchScreen = useHasTouch()
  const prefersDark = usePrefersDarkMode()
  const router = useRouter()

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

      router.push(`/feelings#${targetEntry.x}`)
    },
    [data]
  )

  // Hovering on a point will change cursor to denote that it is a link
  const handlePointHover = useCallback<CoreChartOptions<ChartType>['onHover']>(
    (event, points) => {
      // @ts-ignore
      if (event.native?.target?.style) {
        // @ts-ignore
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
              pointRadius: 5,
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
                title: (item) => `📅   ${formatISO(parseISO(item[0].label))}`,
                label: (item) =>
                  `${Object.values(MoodMapping)[item.parsed.y]}  I felt ${
                    Object.keys(MoodMapping)[item.parsed.y]
                  }`,
              },
            },
          },
          scales: {
            x: {
              // @ts-ignore
              min: new Date('2022-01-01'),
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
