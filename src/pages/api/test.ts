import type { APIRoute } from 'astro'

export const prerender = false

export const get: APIRoute = async () => {
  return {
    body: JSON.stringify({
      NODE_ENV: import.meta.env.NODE_ENV,
      NETLIFY_BUILD_HOOK: import.meta.env.NETLIFY_BUILD_HOOK,
    }),
  }
}
