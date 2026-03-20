import type { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  console.log('Attempting to post yearly Last.FM cover to social media')

  try {
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

    const responseBody = await resp.text()
    console.log(`Response status: ${resp.status}, body: ${responseBody}`)

    return {
      statusCode: resp.ok ? 200 : resp.status,
    }
  } catch (error) {
    console.error('Failed to post yearly Last.FM cover', error)
    return {
      statusCode: 500,
    }
  }
}
