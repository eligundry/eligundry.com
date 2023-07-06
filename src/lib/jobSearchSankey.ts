import type { SankeyDataPoint } from 'chart.js'

export type StatusEmoji = string | '✅' | '❌' | '🙅‍♂️' | ''

export interface JobSearchItem {
  Company: string
  Date: string
  'Applied?': StatusEmoji
  'Callback?': StatusEmoji
  'Code Test?': StatusEmoji
  'On Site?': StatusEmoji
  'Offer?': StatusEmoji
}

export const jobSearchDataToSankeyPoints = (
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
