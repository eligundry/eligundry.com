import 'chartjs-adapter-date-fns'
import 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { parseISO, formatISO, subDays } from 'date-fns'
import { useAsync, useMountEffect } from '@react-hookz/web'

// import { toolTipTheme } from '@/utils/charts'
import type { DaylioChartEntry } from '../lib/daylio'
import { MoodMapping } from '../lib/enums'
import { cssvar, tooltipTheme } from '../lib/charts'
import useTheme from '../hooks/useTheme'

const DaylioChart = () => {
  // const isTouchScreen = useHasTouch(true)
  const isTouchScreen = false
  const { darkMode } = useTheme()
  const [{ error, status, result: data }, actions] = useAsync<
    DaylioChartEntry[]
  >(async () => fetch(`/api/daylio/chart.json`).then((resp) => resp.json()), [])

  useMountEffect(actions.execute)

  if (error || status !== 'success' || !data.length) {
    return null
  }

  console.log(tooltipTheme())

  return (
    <div style={{ minHeight: '153px' }}>
      <Chart
        type="line"
        height={60}
        data={{
          labels: Object.values(MoodMapping).map((_, i) => i),
          datasets: [
            {
              data,
              backgroundColor: 'transparent',
              pointStyle: 'rect',
              borderColor: `hsl(${cssvar('--p')})`,
              pointBorderColor: `hsl(${cssvar('--p')})`,
              pointBackgroundColor: `hsl(${cssvar('--p')})`,
              pointRadius: 5,
            },
          ],
        }}
        options={{
          events: isTouchScreen
            ? []
            : ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
          onClick: (_, points) => {
            if (!points?.length) {
              return
            }

            const targetEntry = data[points[0].index]

            if (!targetEntry) {
              return
            }

            window.location.href = `/feelings#${targetEntry.x}`
          },
          onHover: (event, points) => {
            // @ts-ignore
            if (event.native?.target?.style) {
              // @ts-ignore
              event.native.target.style.cursor = points.length
                ? 'pointer'
                : 'default'
            }
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              ...tooltipTheme(),
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
              min: subDays(parseISO(data[0].x), 1).toISOString(),
              ticks: {
                callback: () => null,
              },
            },
            y: {
              min: 0,
              grid: {
                color: `hsl(${cssvar(darkMode ? '--n' : '--b3')})`,
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
