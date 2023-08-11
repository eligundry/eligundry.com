import type { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  if (process.env.CONTEXT !== 'production' && process.env.BRANCH !== 'main') {
    console.log('Not in production, skipping Last.FM cover post', {
      CONTEXT: process.env.CONTEXT,
      BRANCH: process.env.BRANCH,
    })
    return {
      statusCode: 204,
    }
  }

  console.log('Attempting to post weekly Last.FM cover to social media')

  const basicAuth = Buffer.from(
    `${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`
  ).toString('base64')
  const body = new URLSearchParams()
  body.set('period', '12month')

  const resp = await fetch(`${process.env.URL}/api/lastfm/post-cover`, {
    method: 'POST',
    body,
    headers: {
      authorization: `Basic ${basicAuth}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
  })

  console.log(resp)

  return {
    statusCode: 200,
  }
}
