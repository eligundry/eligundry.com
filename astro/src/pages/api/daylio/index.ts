import type { APIRoute, EndpointOutput } from 'astro'
import daylio from '../../../lib/daylio'
import blueSky from '../../../lib/bluesky'
import { dedent } from '../../../lib/utils'

export const prerender = false

export const get: APIRoute = async () => {
  const entries = await daylio.getAll()

  return new Response(JSON.stringify(entries), {
    headers: {
      'content-type': 'application/json',
    },
  })
}

function endpointOutputToResponse(
  output: EndpointOutput & {
    status?: number
    headers?: Record<string, string>
  }
) {
  return new Response(output.body, {
    status: output.status ?? 200,
    headers: {
      'content-type': 'application/json',
      ...(output.headers ?? {}),
    },
  })
}

export const post: APIRoute = async ({ request }) => {
  try {
    var formData = await request.formData()
  } catch (e: any) {
    return endpointOutputToResponse({
      status: 400,
      body: JSON.stringify({
        error: 'could not get formData from request',
        details: e.message,
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  const file = formData.get('file')

  if (!file) {
    return endpointOutputToResponse({
      status: 400,
      body: JSON.stringify({
        error: 'no file found in request',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  if (typeof file === 'string') {
    return endpointOutputToResponse({
      status: 400,
      body: JSON.stringify({
        error: 'file was a string, not a file',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const entries = await daylio.processCSV(buffer)

  // if (process.env.NODE_ENV === 'production') {
  const unpublishedPosts = await daylio.getAll({ unpublished: true })
  console.log({ unpublishedPosts })

  await Promise.all(
    unpublishedPosts.map(async (post) => {
      const url = `https://eligundry.com/feelings/#${post.slug}`
      const maxTextLength = 300 - url.length
      let text = dedent(`
${daylio.tweetPrefix(post)}

${post.notes?.map((note) => `* ${note}`).join('\n')}
      `)
      let message = text + '\n\n' + url

      if (message.length > maxTextLength) {
        message =
          dedent(text.slice(0, maxTextLength - url.length - 1)) +
          '…' +
          '\n\n' +
          url
      }

      console.log(message.slice(0, 300))

      // return blueSky.sendPost(text + '\n\n' + url)
    })
  )
  // }

  return endpointOutputToResponse({
    body: JSON.stringify(entries),
    headers: {
      'content-type': 'application/json',
    },
  })
}
