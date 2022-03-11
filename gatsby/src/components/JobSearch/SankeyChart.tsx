import React from 'react'
import GenericChart from 'react-chartjs-2'
import { Chart, SankeyDataPoint } from 'chart.js'
import { SankeyController, Flow } from 'chartjs-chart-sankey'
import { theme } from 'twin.macro'

import { toolTipTheme, textColor } from '../../utils/charts'
import { usePrefersDarkMode } from '../../layout/ThemeModeProvider'
import jobSearch2022 from './2022.json'

Chart.register(SankeyController, Flow)

type StatusEmoji = string | '✅' | '❌' | '🙅‍♂️' | ''

export interface JobSearchItem {
  Company: string
  Date: string
  'Applied?': StatusEmoji
  'Callback?': StatusEmoji
  'Code Test?': StatusEmoji
  'On Site?': StatusEmoji
  'Offer?': StatusEmoji
}

const jobSearchDataToSankeyPoints = (
  items: JobSearchItem[]
): SankeyDataPoint[] => {
  // Handle all the happy paths
  const callbacks = {
    from: 'Applied',
    to: 'Callback',
    flow: items.filter((item) => item['Callback?'].includes('✅')).length,
  }
  const codeTests = {
    from: 'Callback',
    to: 'Code Test',
    flow: items.filter((item) => item['Code Test?'].includes('✅')).length,
  }
  const onSites = {
    from: 'Code Test',
    to: 'On Site',
    flow: items.filter((item) => item['On Site?'].includes('✅')).length,
  }
  const offers = {
    from: 'On Site',
    to: 'Offer',
    flow: items.filter((item) => item['Offer?'].includes('✅')).length,
  }
  const acceptedOffers = {
    from: 'Offer',
    to: 'Offer Accepted',
    flow: 1,
  }
  // Handle company rejections
  const rejectionCallbacks = {
    from: 'Applied',
    to: 'Rejection',
    flow: items.filter((item) => item['Callback?'].includes('❌')).length,
  }
  const rejectionCodeTests = {
    from: 'Code Test',
    to: 'Rejection',
    flow: items.filter(
      (item) =>
        item['Callback?'].includes('✅') && item['Code Test?'].includes('❌')
    ).length,
  }
  const rejectionOnSite = {
    from: 'On Site',
    to: 'Rejection',
    flow: items.filter(
      (item) =>
        item['Code Test?'].includes('✅') && item['On Site?'].includes('❌')
    ).length,
  }
  const rejectionOffer = {
    from: 'On Site',
    to: 'Not Offered',
    flow: items.filter(
      (item) => item['On Site?'].includes('✅') && item['Offer?'].includes('❌')
    ).length,
  }
  // Handle me dropping out of processes
  const dropoutCallback = {
    from: 'Applied',
    to: 'Drop Out',
    flow: items.filter(
      (item) =>
        item['Callback?'].includes('✅') && item['Code Test?'].includes('🙅‍♂️')
    ).length,
  }
  const dropoutCodeTest = {
    from: 'Code Test',
    to: 'Drop Out',
    flow: items.filter(
      (item) =>
        item['Code Test?'].includes('✅') && item['On Site?'].includes('🙅‍♂️')
    ).length,
  }
  const dropoutOnSite = {
    from: 'Code Test',
    to: 'Drop Out',
    flow: items.filter(
      (item) => item['On Site?'].includes('✅') && item['Offer?'].includes('🙅‍♂️')
    ).length,
  }
  const dropoutOffers = {
    from: 'Offer',
    to: 'Offer Declined',
    flow: items.filter((item) => item['Offer?'].includes('✅')).length - 1,
  }

  return [
    callbacks,
    codeTests,
    onSites,
    offers,
    acceptedOffers,
    rejectionCallbacks,
    rejectionCodeTests,
    rejectionOnSite,
    rejectionOffer,
    dropoutCallback,
    dropoutCodeTest,
    dropoutOnSite,
    dropoutOffers,
  ]
}

const chartPallete = (value: string) => {
  switch (value) {
    case 'Applied':
      return theme`colors.primary`
    case 'Callback':
      return theme`colors.primary`
    case 'Code Test':
    case 'On Site':
    case 'Offer':
    case 'Offer Accepted':
      return theme`colors.green`
    case 'Drop Out':
    case 'Offer Declined':
      return theme`colors.yellow`
    case 'Rejection':
    case 'Not Offered':
      return theme`colors.red`
    default:
      return theme`colors.primary`
  }
}

const JobSearchSankeyChart: React.FC<{ data: SankeyDataPoint[] }> = ({
  data,
}) => {
  const prefersDark = usePrefersDarkMode()

  return (
    <>
      <GenericChart
        aria-label="Sankey chart of my job search"
        type="sankey"
        data={{
          datasets: [
            {
              label: 'Job Search',
              data,
              color: textColor(prefersDark),
            },
          ],
        }}
        options={{
          colorFrom: (c: any) => chartPallete(c.raw.from),
          colorTo: (c: any) => chartPallete(c.raw.to),
          colorMode: 'to',
          plugins: {
            tooltip: {
              ...toolTipTheme(prefersDark),
            },
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

export default JobSearchSankeyChart
