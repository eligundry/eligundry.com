import type React from 'react'
import { Chart as ChartJS, SankeyDataPoint } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { SankeyController, Flow } from 'chartjs-chart-sankey'

import { tooltipTheme, cssvar } from '../../lib/charts'
import jobSearch2022 from './2022.json'
import { jobSearchDataToSankeyPoints } from '../../lib/jobSearchSankey'

ChartJS.register(SankeyController, Flow)

const chartPallete = (value: string) => {
  switch (value) {
    case 'Applied':
      return `hsl(${cssvar('--p')})`
    case 'Callback':
      return `hsl(${cssvar('--p')})`
    case 'Code Test':
    case 'On Site':
    case 'Offer':
    case 'Offer Accepted':
      return `hsl(${cssvar('--su')})`
    case 'Drop Out':
    case 'Offer Declined':
      return `hsl(${cssvar('--wa')})`
    case 'Rejection':
    case 'Not Offered':
      return `hsl(${cssvar('--er')})`
    default:
      return `hsl(${cssvar('--p')})`
  }
}

const JobSearchSankeyChart: React.FC<{ data: SankeyDataPoint[] }> = ({
  data,
}) => {
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
          // @ts-ignore
          colorTo: (c) => chartPallete(c.raw.to),
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

export default JobSearchSankeyChartByYear
