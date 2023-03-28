import type React from 'react'
import { Chart as ChartJS, SankeyDataPoint } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { SankeyController, Flow } from 'chartjs-chart-sankey'

import { tooltipTheme, cssvar } from '../../lib/charts'
import theme from '../../theme.json'
import jobSearch2022 from './2022.json'
import { jobSearchDataToSankeyPoints } from '../../lib/jobSearchSankey'

try {
  ChartJS.register(SankeyController, Flow)
  /* eslint-disable-next-line no-empty */
} catch (e) {}

const chartPallete = (value: string) => {
  switch (value) {
    case 'Applied':
      return theme.colors.primary
    case 'Callback':
      return theme.colors.primary
    case 'Code Test':
    case 'On Site':
    case 'Offer':
    case 'Offer Accepted':
      return theme.colors.success
    case 'Drop Out':
    case 'Offer Declined':
      return theme.colors.warning
    case 'Rejection':
    case 'Not Offered':
      return theme.colors.error
    default:
      return theme.colors.primary
  }
}

const JobSearchSankeyChart: React.FC<{ data: SankeyDataPoint[] }> = ({
  data,
}) => {
  return (
    <>
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
      <noscript>
        <table>
          <thead>
            <tr>
              <th>Progress Step</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={`${row.from} -> ${row.to}`}>
                <td>
                  {row.from} → {row.to}
                </td>
                <td>{row.flow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </noscript>
    </>
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
