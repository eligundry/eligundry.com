import React from 'react'
import GenericChart from 'react-chartjs-2'
import { Chart, SankeyDataPoint } from 'chart.js'
import { SankeyController, Flow } from 'chartjs-chart-sankey'

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
  const applied = {
    from: 'Found',
    to: 'Applied',
    flow: items.length,
  }
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
    from: 'Code Test',
    to: 'Rejection',
    flow: items.filter(
      (item) =>
        item['Code Test?'].includes('✅') && item['On Site?'].includes('❌')
    ).length,
  }
  const rejectionOffer = {
    from: 'On Site',
    to: 'Rejection',
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

  return [
    applied,
    callbacks,
    codeTests,
    onSites,
    offers,
    rejectionCallbacks,
    rejectionCodeTests,
    rejectionOnSite,
    rejectionOffer,
    dropoutCallback,
    dropoutCodeTest,
    dropoutOnSite,
  ]
}

const JobSearchSankeyChart: React.FC<{ data: SankeyDataPoint[] }> = ({
  data,
}) => {
  return (
    <GenericChart
      type="sankey"
      data={{
        datasets: [
          {
            label: 'Job Search',
            data,
          },
        ],
      }}
    />
  )
}

export const JobSearch2k22SankeyChart: React.FC = () => {
  return (
    <JobSearchSankeyChart data={jobSearchDataToSankeyPoints(jobSearch2022)} />
  )
}

export default JobSearchSankeyChart
