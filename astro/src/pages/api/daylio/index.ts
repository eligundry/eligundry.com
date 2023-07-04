import type { APIRoute, EndpointOutput } from 'astro'
import daylio from '../../../lib/daylio'

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

  return endpointOutputToResponse({
    body: JSON.stringify(entries),
    headers: {
      'content-type': 'application/json',
    },
  })
}
