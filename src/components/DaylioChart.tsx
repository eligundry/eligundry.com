import { Line } from 'react-chartjs-2'
import { parseISO, formatISO, subDays } from 'date-fns'

// import { toolTipTheme } from '@/utils/charts'
import type { DaylioChartEntry } from '../lib/daylio'
import { MoodMapping } from '../lib/enums'
import { cssvar, tooltipTheme } from '../lib/charts'
import useTheme from '../hooks/useTheme'

interface Props {
  data: DaylioChartEntry[]
}

const DaylioChart: React.FC<Props> = ({ data }) => {
  // const isTouchScreen = useHasTouch(true)
  const isTouchScreen = false
  const { darkMode } = useTheme()

  if (!data?.length) {
    return null
  }

  return (
    <div style={{ minHeight: '153px' }}>
      <Line
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

            window.location.href = `/feelings/#${targetEntry.x}`
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
                  `${Object.values(MoodMapping)[item.parsed.y]}  I felt ${Object.keys(MoodMapping)[item.parsed.y]
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
