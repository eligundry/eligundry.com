import path from 'node:path'
import type { APIRoute } from 'astro'
import * as dateFns from 'date-fns'
import config from '../config'
import { getLastModFromFile } from '../lib/lastModified'
import { getResumeSource } from '../lib/resume/build'
import { toJsonResume, toSuperset } from '../lib/resume/model'

// My resume as JSON Resume (https://jsonresume.org/schema), built from the same
// content as /resume/.
export const GET: APIRoute = async () => {
  const [source, ...modified] = await Promise.all([
    getResumeSource(),
    ...[
      path.join('src', 'content', 'resumeExperiences'),
      path.join('src', 'content', 'resumeSkills.yaml'),
      path.join('src', 'content', 'resumeActivities.yaml'),
      path.join('src', 'lib', 'resume', 'basics.ts'),
    ].map(getLastModFromFile),
  ])

  const resume = toJsonResume(
    toSuperset(source, {
      canonical: new URL('/resume.json', config.url).toString(),
      version: 'v1.0.0',
      lastModified: dateFns.max(modified).toISOString().slice(0, 19),
    })
  )

  return new Response(JSON.stringify(resume, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
