import { indexResume } from '../resume/model'
import { parseOp } from './serialize'
import { newItemId, TailorError, type Op } from './state'
import type { TailorStore } from './store'

// Exposes resume tailoring to in-browser agents through WebMCP
// (https://github.com/webmachinelearning/webmcp). An agent reads a job
// posting, calls get_resume, then hides, reorders and rewrites content. Every
// write is logged with a reason, can be reverted, and is saved in the URL.

type Json = Record<string, unknown>

interface ToolResult {
  content: { type: 'text'; text: string }[]
  isError?: boolean
}

const ok = (value: unknown): ToolResult => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
})

const fail = (message: string): ToolResult => ({
  content: [{ type: 'text', text: message }],
  isError: true,
})

const REASON = {
  type: 'string',
  description:
    'Why this change makes the resume a better fit for the job. Shown to the resume owner in the change log.',
}

const ID_GUIDE = `Ids come from get_resume: sections are "section:work", "section:education", "section:skills" and "section:activities"; jobs and schools use their "x-id" (e.g. "chord"); bullets are "<job>:<n>" (e.g. "chord:0"); a job's paragraph is "<job>:summary"; skill lines are "skills:<id>"; activities are "activities:<id>"; the headline pieces are "basics:label", "basics:tagline" and "basics:summary"; section titles are "<section id>:title".`

export function createTools(store: TailorStore) {
  const effective = (id: string) =>
    indexResume(store.tailored.source).get(id)?.node

  const change = async (op: Op, reason: unknown) => {
    const record = await store.apply(parseOp(op), String(reason ?? ''))
    return {
      changeId: record.id,
      target: record.target,
      before: record.before,
      after: record.after,
    }
  }

  const tools: ModelContextTool[] = [
    {
      name: 'get_resume',
      description: `Returns Eli Gundry's resume as it's currently tailored, as a JSON Resume (https://jsonresume.org/schema) document with "x-" extensions: "x-id" on every item, "x-highlights"/"x-summary" with the markdown shown on the page, "x-hidden" for hidden content, "x-sections" for section order and titles, and "x-activities" for the Activities & Interests bullets. Also returns the job context and print options. ${ID_GUIDE} Start here before making changes.`,
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () =>
        ok({
          resume: store.superset(),
          job: store.tailored.job ?? null,
          highlightTerms: store.tailored.highlightTerms,
          print: store.tailored.print,
          changeCount: store.state.changes.length,
        }),
    },
    {
      name: 'export_json_resume',
      description:
        'Returns the tailored resume as a schema-valid JSON Resume v1.0.0 document (hidden content removed, no extensions). Useful for applicant tracking systems.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ok(store.jsonResume()),
    },
    {
      name: 'get_changes',
      description:
        'Lists every tailoring change so far, with its id, target, before/after values, reason and any error from replaying it.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ok(store.tailored.log),
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
      execute: async (input: Json) =>
        ok(
          await change({ type: 'setJob', job: input as never }, 'Job context')
        ),
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
      execute: async ({ ids, visible, reason }: Json) =>
        ok(await change({ type: 'setVisibility', ids, visible } as Op, reason)),
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
      execute: async ({ container, ids, reason }: Json) => {
        const result = await change(
          { type: 'reorder', container, ids } as Op,
          reason
        )
        return ok(result)
      },
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
      execute: async ({ id, markdown, reason }: Json) => {
        const result = await change(
          { type: 'rewrite', id, markdown } as Op,
          reason
        )
        return ok({ ...result, effective: effective(String(id)) })
      },
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
      execute: async ({ markdown, reason }: Json) =>
        ok(
          await change(
            { type: 'rewrite', id: 'basics:summary', markdown } as Op,
            reason
          )
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
      execute: async ({ parentId, markdown, after, reason }: Json) => {
        const id = newItemId(String(parentId), store.state)
        const result = await change(
          { type: 'addItem', parentId, id, markdown, after } as Op,
          reason
        )
        return ok({ ...result, id, effective: effective(id) })
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
      execute: async ({ id, keywords, reason }: Json) => {
        const result = await change(
          { type: 'setSkillKeywords', id, keywords } as Op,
          reason
        )
        return ok({ ...result, effective: effective(String(id)) })
      },
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
      execute: async ({ terms }: Json) =>
        ok(
          await change({ type: 'highlight', terms } as Op, 'Highlight keywords')
        ),
    },
    {
      name: 'revert_change',
      description: 'Undoes one change by its id (from get_changes).',
      inputSchema: {
        type: 'object',
        properties: { changeId: { type: 'string' } },
        required: ['changeId'],
      },
      execute: async ({ changeId }: Json) => {
        await store.revert(String(changeId))
        return ok({ reverted: changeId, remaining: store.state.changes.length })
      },
    },
    {
      name: 'reset_tailoring',
      description: 'Undoes every change, restoring the original resume.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { destructiveHint: true },
      execute: async () => {
        await store.reset()
        return ok({ reset: true })
      },
    },
    {
      name: 'get_print_layout',
      description:
        'Estimates how the resume paginates when printed to PDF (US Letter): which ids start on each page, blocks split across pages, jobs pushed to the next page (with the gap they leave), headings stranded at the bottom of a page, and how full the last page is, plus hints for fixing them. Check this after tailoring and fix ugly breaks with set_print_options, set_visibility or rewrite.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ok(await store.measure()),
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
      execute: async ({ reason, ...print }: Json) => {
        const result = await change({ type: 'setPrint', print } as Op, reason)
        return ok({ ...result, layout: await store.measure() })
      },
    },
    {
      name: 'get_share_url',
      description:
        'Returns a link to this tailored resume. The tailoring is stored in the link itself, so it can be shared or opened later to print.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ok({ url: store.shareUrl }),
    },
    {
      name: 'open_print_dialog',
      description:
        "Opens the browser's print dialog so the user can save the tailored resume as a PDF.",
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        setTimeout(() => window.print(), 0)
        return ok({ opened: true })
      },
    },
  ]

  // Surface validation problems to the agent as tool errors.
  return tools.map((tool) => ({
    ...tool,
    execute: async (input: Json) => {
      try {
        return await tool.execute(input ?? {})
      } catch (error) {
        if (error instanceof TailorError || error instanceof Error) {
          return fail(error.message)
        }
        return fail(String(error))
      }
    },
  }))
}

/** Registers the tools if the browser (or an extension) supports WebMCP. */
export function registerTools(store: TailorStore): boolean {
  const modelContext = navigator.modelContext
  if (!modelContext) {
    return false
  }

  const tools = createTools(store)
  if (typeof modelContext.registerTool === 'function') {
    for (const tool of tools) {
      modelContext.registerTool(tool)
    }
  } else if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools })
  } else {
    return false
  }
  return true
}
