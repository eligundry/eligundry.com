import type { Tailoring } from './useTailoring'
import { indexResume } from '../../lib/resume/model'
import { newItemId } from '../../lib/resumeTailor/state'

// WebMCP tools (https://github.com/webmachinelearning/webmcp) for tailoring
// the resume to a job posting. An agent reads the posting, calls get_resume,
// then hides, reorders and rewrites content. Every write is logged with a
// reason, can be reverted, and is saved in the URL.
//
// Each tool's `execute` returns plain JSON or throws. `ResumeTools` registers
// them with `usewebmcp`, which turns those into MCP responses.

type Input = Record<string, any>

export interface ResumeTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean }
  execute: (input: Input, tailoring: Tailoring) => unknown
}

const REASON = {
  type: 'string',
  description:
    'Why this change makes the resume a better fit for the job. Shown to the resume owner in the change log.',
}

const NO_INPUT = { type: 'object', properties: {} }

const ID_GUIDE = `Ids come from get_resume: sections are "section:work", "section:education", "section:skills" and "section:activities"; jobs and schools use their "x-id" (e.g. "chord"); bullets are "<job>:<n>" (e.g. "chord:0"); a job's paragraph is "<job>:summary"; skill lines are "skills:<id>"; activities are "activities:<id>"; the headline pieces are "basics:label", "basics:tagline" and "basics:summary"; section titles are "<section id>:title".`

/** Applies a change and describes it for the agent. */
function change(tailoring: Tailoring, op: Input, reason: unknown) {
  const { id, target, before, after } = tailoring.apply(
    op,
    String(reason ?? '')
  )
  return { changeId: id, target, before, after }
}

/** The tailored state of a node, so the agent can check its work. */
const effective = (tailoring: Tailoring, id: string) =>
  indexResume(tailoring.current().source).get(id)?.node

export const resumeTools: ResumeTool[] = [
  {
    name: 'get_resume',
    description: `Returns Eli Gundry's resume as it's currently tailored, as a JSON Resume (https://jsonresume.org/schema) document with "x-" extensions: "x-id" on every item, "x-highlights"/"x-summary" with the markdown shown on the page, "x-hidden" for hidden content, "x-sections" for section order and titles, and "x-activities" for the Activities & Interests bullets. Also returns the job context and print options. ${ID_GUIDE} Start here before making changes.`,
    inputSchema: NO_INPUT,
    annotations: { readOnlyHint: true },
    execute: (_, tailoring) => {
      const { job, highlightTerms, print } = tailoring.current()
      return {
        resume: tailoring.superset(),
        job: job ?? null,
        highlightTerms,
        print,
        changeCount: tailoring.getState().changes.length,
      }
    },
  },
  {
    name: 'export_json_resume',
    description:
      'Returns the tailored resume as a schema-valid JSON Resume v1.0.0 document (hidden content removed, no extensions). Useful for applicant tracking systems.',
    inputSchema: NO_INPUT,
    annotations: { readOnlyHint: true },
    execute: (_, tailoring) => tailoring.jsonResume(),
  },
  {
    name: 'get_changes',
    description:
      'Lists every tailoring change so far, with its id, target, before/after values, reason and any error from replaying it.',
    inputSchema: NO_INPUT,
    annotations: { readOnlyHint: true },
    execute: (_, tailoring) => tailoring.current().log,
  },
  {
    name: 'set_job_context',
    description:
      'Records the job this resume is being tailored for. Shown in a banner on the page and used for the PDF file name. Call this first with details from the job posting.',
    inputSchema: {
      type: 'object',
      properties: {
        company: { type: 'string' },
        title: { type: 'string', description: 'Job title' },
        url: { type: 'string', description: 'Link to the job posting' },
        requirements: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key requirements from the posting',
        },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Technologies and skills the posting emphasizes',
        },
      },
    },
    execute: (job, tailoring) =>
      change(tailoring, { type: 'setJob', job }, 'Job context'),
  },
  {
    name: 'set_visibility',
    description: `Hides or shows sections, jobs, schools, bullets, skill lines or activities. Hidden content is left out of the page, the printed PDF and export_json_resume. Showing a job that's normally left off the printed resume puts it back in print. ${ID_GUIDE}`,
    inputSchema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' }, minItems: 1 },
        visible: { type: 'boolean' },
        reason: REASON,
      },
      required: ['ids', 'visible', 'reason'],
    },
    execute: ({ ids, visible, reason }, tailoring) =>
      change(tailoring, { type: 'setVisibility', ids, visible }, reason),
  },
  {
    name: 'reorder',
    description:
      'Reorders the children of a container. Containers are "sections" (the section order), a section id (its jobs, schools, skill lines or activities) or a job id (its bullets). List the ids in the new order; ids left out keep their relative order after the listed ones.',
    inputSchema: {
      type: 'object',
      properties: {
        container: { type: 'string' },
        ids: { type: 'array', items: { type: 'string' }, minItems: 1 },
        reason: REASON,
      },
      required: ['container', 'ids', 'reason'],
    },
    execute: ({ container, ids, reason }, tailoring) =>
      change(tailoring, { type: 'reorder', container, ids }, reason),
  },
  {
    name: 'rewrite',
    description: `Replaces the text of a bullet, job summary, skill line, activity, section title or headline piece with new inline markdown (links, **bold**, *italics* and \`code\` are supported; HTML is not). Organization names, positions, dates and locations are facts and can't be changed. Keep claims truthful: rephrase and emphasize, don't invent experience. ${ID_GUIDE}`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        markdown: { type: 'string', maxLength: 2000 },
        reason: REASON,
      },
      required: ['id', 'markdown', 'reason'],
    },
    execute: ({ id, markdown, reason }, tailoring) => ({
      ...change(tailoring, { type: 'rewrite', id, markdown }, reason),
      effective: effective(tailoring, id),
    }),
  },
  {
    name: 'set_summary',
    description:
      'Adds (or replaces) a short professional summary at the top of the resume, written for this job. Inline markdown only. Pass an empty string to remove it.',
    inputSchema: {
      type: 'object',
      properties: {
        markdown: { type: 'string', maxLength: 2000 },
        reason: REASON,
      },
      required: ['markdown', 'reason'],
    },
    execute: ({ markdown, reason }, tailoring) =>
      change(
        tailoring,
        { type: 'rewrite', id: 'basics:summary', markdown },
        reason
      ),
  },
  {
    name: 'add_item',
    description:
      'Adds a new bullet to a job (parentId is the job id), a new skill line (parentId "section:skills") or a new activity (parentId "section:activities"). Inline markdown only. Only add things that are true; prefer rewriting existing bullets.',
    inputSchema: {
      type: 'object',
      properties: {
        parentId: { type: 'string' },
        markdown: { type: 'string', maxLength: 2000 },
        after: {
          type: 'string',
          description: 'Insert after this sibling id. Defaults to the end.',
        },
        reason: REASON,
      },
      required: ['parentId', 'markdown', 'reason'],
    },
    execute: ({ parentId, markdown, after, reason }, tailoring) => {
      const id = newItemId(String(parentId), tailoring.getState())
      const op = { type: 'addItem', parentId, id, markdown, after }
      return {
        ...change(tailoring, op, reason),
        id,
        effective: effective(tailoring, id),
      }
    },
  },
  {
    name: 'set_skill_keywords',
    description:
      'Replaces the technologies listed on a skill line (e.g. "skills:languages"), in order. Use it to lead with what the job asks for or drop irrelevant ones. Known technologies keep their links; pass {name, url} to link a new one.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        keywords: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  url: { type: 'string' },
                },
                required: ['name'],
              },
            ],
          },
          minItems: 1,
        },
        reason: REASON,
      },
      required: ['id', 'keywords', 'reason'],
    },
    execute: ({ id, keywords, reason }, tailoring) => ({
      ...change(tailoring, { type: 'setSkillKeywords', id, keywords }, reason),
      effective: effective(tailoring, id),
    }),
  },
  {
    name: 'highlight_keywords',
    description:
      'Subtly highlights these terms wherever they appear on the page (on screen only) so a reader can see how the resume matches the posting. Replaces any previous terms; pass [] to clear.',
    inputSchema: {
      type: 'object',
      properties: {
        terms: { type: 'array', items: { type: 'string' }, maxItems: 50 },
      },
      required: ['terms'],
    },
    execute: ({ terms }, tailoring) =>
      change(tailoring, { type: 'highlight', terms }, 'Highlight keywords'),
  },
  {
    name: 'revert_change',
    description: 'Undoes one change by its id (from get_changes).',
    inputSchema: {
      type: 'object',
      properties: { changeId: { type: 'string' } },
      required: ['changeId'],
    },
    execute: ({ changeId }, tailoring) => {
      tailoring.revert(String(changeId))
      return {
        reverted: changeId,
        remaining: tailoring.getState().changes.length,
      }
    },
  },
  {
    name: 'reset_tailoring',
    description: 'Undoes every change, restoring the original resume.',
    inputSchema: NO_INPUT,
    annotations: { destructiveHint: true },
    execute: (_, tailoring) => {
      tailoring.reset()
      return { reset: true }
    },
  },
  {
    name: 'get_print_layout',
    description:
      'Estimates how the resume paginates when printed to PDF (US Letter): which ids start on each page, blocks split across pages, jobs pushed to the next page (with the gap they leave), headings stranded at the bottom of a page, and how full the last page is, plus hints for fixing them. Check this after tailoring and fix ugly breaks with set_print_options, set_visibility or rewrite.',
    inputSchema: NO_INPUT,
    annotations: { readOnlyHint: true },
    execute: (_, tailoring) => tailoring.measure(),
  },
  {
    name: 'set_print_options',
    description:
      'Adjusts print layout. breakBefore: ids (jobs, sections, skill lines…) that start a new printed page; replaces the previous list. density: "compact" tightens spacing. fontScale: 0.8–1.1 scales printed text. targetPages: desired page count, used by get_print_layout hints. Returns the new print layout.',
    inputSchema: {
      type: 'object',
      properties: {
        breakBefore: { type: 'array', items: { type: 'string' } },
        density: { type: 'string', enum: ['normal', 'compact'] },
        fontScale: { type: 'number', minimum: 0.8, maximum: 1.1 },
        targetPages: { type: 'integer', minimum: 1 },
        reason: REASON,
      },
      required: ['reason'],
    },
    execute: async ({ reason, ...print }, tailoring) => ({
      ...change(tailoring, { type: 'setPrint', print }, reason),
      layout: await tailoring.measure(),
    }),
  },
  {
    name: 'get_share_url',
    description:
      'Returns a link to this tailored resume. The tailoring is stored in the link itself, so it can be shared or opened later to print.',
    inputSchema: NO_INPUT,
    annotations: { readOnlyHint: true },
    execute: async (_, tailoring) => ({ url: await tailoring.link() }),
  },
  {
    name: 'open_print_dialog',
    description:
      "Opens the browser's print dialog so the user can save the tailored resume as a PDF.",
    inputSchema: NO_INPUT,
    execute: () => {
      setTimeout(() => window.print(), 0)
      return { opened: true }
    },
  },
]
