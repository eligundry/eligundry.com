import type { APIRoute } from 'astro'
import { generatePublicationWellKnown } from '@bryanguffey/astro-standard-site'

const did = import.meta.env.STANDARD_SITE_DID || process.env.STANDARD_SITE_DID
const publicationRkey =
  import.meta.env.STANDARD_SITE_PUBLICATION_RKEY ||
  process.env.STANDARD_SITE_PUBLICATION_RKEY

// Proves ownership of the standard.site publication to ATProto readers.
// See https://standard.site/. Configured via STANDARD_SITE_* env vars, which
// are produced by `pnpm standard-site:create-publication`.
export const GET: APIRoute = () => {
  if (!did || !publicationRkey) {
    return new Response('standard.site publication is not configured.', {
      status: 404,
    })
  }

  return new Response(generatePublicationWellKnown({ did, publicationRkey }), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  })
}
