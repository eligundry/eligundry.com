import React from 'react'
import { Line } from 'react-chartjs-2'
import subMonths from 'date-fns/subMonths'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import 'chartjs-adapter-date-fns'

import useFeelingsChartData from './useFeelingsChartData'
import useIsMobile from '../../utils/useIsMobile'
import { MoodMapping } from './types'

const DaylioChart: React.FC = () => {
  const timeWindow = subMonths(new Date(), 1)
  const data = useFeelingsChartData(timeWindow)
  const isMobile = useIsMobile()

  return (
    <Line
      type="line"
      height={isMobile ? 100 : 50}
      data={{
        labels: Object.values(MoodMapping).map((_, i) => i),
        datasets: [
          {
            data,
            backgroundColor: 'transparent',
            pointStyle: 'rect',
            borderColor: 'rgb(184, 50, 128)',
            pointBorderColor: 'rgb(56, 178, 172)',
            pointBackgroundColor: 'rgb(56, 178, 172)',
            radius: 5,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            backgroundColor: 'white',
            titleFont: {
              size: 14,
            },
            titleColor: 'black',
            bodyFont: {
              size: 16,
            },
            bodyColor: 'black',
            borderWidth: 1,
            borderColor: 'rgb(226 232 240)',
            callbacks: {
              title: (item, _) => {
                return `📅   ${formatISO(parseISO(item[0].raw.x))}`
              },
              // @ts-ignore
              label: (item, _) => {
                return `${Object.values(MoodMapping)[item.raw.y]}  I felt ${
                  Object.keys(MoodMapping)[item.raw.y]
                }`
              },
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
            ticks: {
              // @ts-ignore
              callback: value => Object.values(MoodMapping)[value],
              font: {
                size: 20,
              },
            },
          },
        },
      }}
    />
  )
}

export default DaylioChart
