import type { APIRoute, EndpointOutput } from 'astro'
import auth from '../../../lib/auth'
import daylio from '../../../lib/daylio'
import blueSky from '../../../lib/bluesky'
import netlify from '../../../lib/netlify'
import { dedent } from '../../../lib/utils'

export const prerender = false

export const get: APIRoute = async () => {
  const entries = await daylio.getAll()

  return new Response(JSON.stringify(entries), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
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
      'content-type': 'application/json; charset=utf-8',
      ...(output.headers ?? {}),
    },
  })
}

export const post: APIRoute = async ({ request }) => {
  if (!auth.check(request.headers.get('authorization'))) {
    return new Response(null, {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="daylio"',
      },
    })
  }

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

  if (import.meta.env.PROD) {
    const unpublishedPosts = await daylio.getAll({ unpublished: true })

    await Promise.all(
      unpublishedPosts.map(async (post) => {
        const url = `https://eligundry.com/feelings/#${post.slug}`
        const maxTextLength = 299 - url.length
        let text = dedent(`
${daylio.tweetPrefix(post)}

${post.notes?.map((note) => `${note}`).join('\n\n')}
      `)
        let message = text + '\n\n' + url

        if (message.length > maxTextLength) {
          console.log(
            `message too long, truncating (length: ${message.length})\n`,
            message
          )
          message =
            dedent(text.slice(0, maxTextLength - 2)).trim() + '…' + '\n\n' + url
          console.log(
            `truncated message (length: ${message.length})\n`,
            message
          )
        }

        return blueSky.sendPost(message)
      })
    )

    await daylio.markAllEntriesAsPublished()

    try {
      const netlifyRes = await netlify.triggerSiteDeploy()

      if (!netlifyRes) {
        console.log('skipped netlify deploy because build hook url is not set')
      }
    } catch (e: any) {
      return endpointOutputToResponse({
        status: 500,
        body: JSON.stringify({
          error: 'failed to trigger netlify deploy',
          details: e.message,
        }),
      })
    }
  }

  return endpointOutputToResponse({
    body: JSON.stringify(entries),
    headers: {
      'content-type': 'application/json',
    },
  })
}
