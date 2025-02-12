import type React from 'react'
import { Chart as ChartJS, type SankeyDataPoint } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { SankeyController, Flow } from 'chartjs-chart-sankey'

import { tooltipTheme, cssvar } from '../../lib/charts'
import jobSearch2022 from './2022.json'
import { jobSearchDataToSankeyPoints } from '../../lib/jobSearchSankey'

ChartJS.register(SankeyController, Flow)

const chartPallete = (value: string) => {
  switch (value) {
    case 'Code Test':
    case 'On Site':
    case 'Offer':
    case 'Offer Accepted':
      return `oklch(${cssvar('--su')})`
    case 'Drop Out':
    case 'Offer Declined':
      return `oklch(${cssvar('--wa')})`
    case 'Rejection':
    case 'Not Offered':
      return `oklch(${cssvar('--er')})`
    case 'Applied':
    case 'Callback':
    default:
      return `oklch(${cssvar('--p')})`
  }
}

const JobSearchSankeyChart: React.FC<{ data: SankeyDataPoint[] }> = ({
  data,
}) => {
  console.log(chartPallete(data[0].from))

  return (
    <div className="mb-4">
      <Chart
        aria-label="Sankey chart of my job search"
        type="sankey"
        data={{
          datasets: [
            {
              label: 'Job Search',
              data,
              color: cssvar('--tw-prose-body'),
            },
          ],
        }}
        options={{
          // @ts-ignore
          colorFrom: (c) => chartPallete(c.raw.from),
          // For whatever reason, the to color must be a hex, otherwise it will
          // not show up
          // @ts-ignore
          colorTo: (c) => oklchToHex(chartPallete(c.raw.to)),
          colorMode: 'to',
          plugins: {
            tooltip: tooltipTheme(),
          },
        }}
      />
    </div>
  )
}

export const JobSearchSankeyChartByYear: React.FC<{ year: number }> = ({
  year,
}) => {
  switch (year) {
    case 2022:
      return (
        <JobSearchSankeyChart
          data={jobSearchDataToSankeyPoints(jobSearch2022)}
        />
      )
    default:
      console.error(`Job Search Sankey chart does not exist for year ${year}`)
      return null
  }
}

function oklchToHex(oklchStr: string): string {
  // Create a canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return '#000000'

  // Draw a rectangle with the OKLCH color
  ctx.fillStyle = oklchStr
  ctx.fillRect(0, 0, 1, 1)

  // Get the pixel data
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

  // Convert to hex
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export default JobSearchSankeyChartByYear
