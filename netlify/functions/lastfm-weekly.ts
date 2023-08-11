import type { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  console.log('Attempting to post weekly Last.FM cover to social media')

  const basicAuth = Buffer.from(
    `${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`
  ).toString('base64')
  const body = new URLSearchParams()
  body.set('period', '7day')

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
