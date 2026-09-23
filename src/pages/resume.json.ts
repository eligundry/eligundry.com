import type { APIRoute } from 'astro'
import config from '../config'
import { getResumeSource } from '../lib/resume/build'
import { toJsonResume, toSuperset } from '../lib/resume/model'

// My resume as JSON Resume (https://jsonresume.org/schema), built from the same
// content as /resume/.
export const GET: APIRoute = async () => {
  const resume = toJsonResume(
    toSuperset(await getResumeSource(), {
      canonical: new URL('/resume.json', config.url).toString(),
      version: 'v1.0.0',
    })
  )

  return new Response(JSON.stringify(resume, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
