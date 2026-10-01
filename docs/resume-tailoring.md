# Resume tailoring (WebMCP) and `/resume.json`

`/resume/` is one Preact island rendered from a resume model. An in-browser AI
agent can tailor it to a job posting through
[WebMCP](https://github.com/webmachinelearning/webmcp). The same model is
published as [JSON Resume](https://jsonresume.org/schema) at `/resume.json`.

## Content

| Source                                | Becomes                                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/content/resumeBasics.yaml`       | `basics` (name, label, tagline, contact info), also used by the print footer                                            |
| `src/content/resumeExperiences/*.mdx` | `work` / `education`; each top-level list item is a highlight, paragraphs a summary. `position` can list several titles |
| `src/content/resumeSkills.yaml`       | `skills`; rendered as "`lead` A, B, and C."                                                                             |
| `src/content/resumeActivities.yaml`   | "Activities & Interests" bullets; `records` map to `projects`, `volunteer`, `awards`, `publications`                    |

`getResumeSource()` (`src/lib/resume/build.ts`) turns the collections into a
`ResumeSource` (`src/lib/resume/model.ts`) with a stable id on everything
(`chord`, `chord:0`, `chord:summary`, `skills:languages`, `activities:talks`,
`section:work`, `section:work:title`, `basics:summary`…). Text nodes carry their
markdown and its HTML, rendered by `src/lib/resume/markdown.ts` with micromark:
build-time content may contain inline HTML; tailored text is escaped.

`toSuperset()` produces JSON Resume plus `x-` extension keys, and
`toJsonResume()` strips the extensions and hidden entries for `/resume.json`.

### Promotions

An experience's `position` is a title, or a list of every title held there
with its dates. With a list, the top-level `startDate`/`endDate` are left out:

```yaml
position:
  - title: Senior Product Engineer
    startDate: 2026-03-01T05:00
  - title: Product Engineer
    startDate: 2025-03-31T05:00
    endDate: 2026-03-01T05:00
```

`normalizeRoles()` sorts them newest first; a title without an end date ends
when the next one begins. The experience's `position` is the newest title and
its dates run from the oldest start to the newest end. The page lists every
title with its own dates under the organization. JSON Resume has no roles, so
each title is its own `work` entry with the same `x-id`; the current one carries
the summary and highlights. Titles are facts, so tailoring can't rewrite them.

### Technologies

`collectTechnologies()` (`src/lib/resume/technologies.ts`) lists what the resume
links to as a technology: every skill keyword plus every markdown link in a job
that isn't to the employer's own site. It's on the source as `technologies`
and in the superset as `x-technologies`. Rendered links to those URLs, both
build-time and tailored, get `itemprop="knowsAbout"`. Only an experience's
heading is the organization's microdata, so these links describe the page's
schema.org `Person`.

## Rendering

`src/pages/resume.astro` renders `<Resume client:load />`
(`src/components/Resume/`):

- `ResumeView` / `Experience` render a `ResumeSource`. `ResumeViewContext`
  switches on review mode (hidden items struck through, rewrites next to the
  original) and forced page breaks.
- `Resume` renders the plain resume. For a `#t=` link, or when the browser
  exposes `document.modelContext`, it loads `TailoredResume` on demand, so other
  visitors never download the tailoring code.
- `TailoredResume` holds the tailoring (`useTailoring`), shows `TailorPanel`,
  highlights keywords with the CSS Custom Highlight API (`useHighlights`) and
  mounts `ResumeTools`.

## Tailoring

- `src/lib/resumeTailor/state.ts`: tailoring is a log of changes replayed over
  the pristine resume. Each change has a reason and can be reverted on its own.
  Organization, position, dates and location can't be rewritten.
- `src/lib/resumeTailor/serialize.ts`: the log is validated and stored,
  deflated, in the URL hash, so links are shareable and nothing is stored on a
  server.
- `src/lib/resumeTailor/voice.ts`: how agents should write (`STYLE_GUIDE`):
  a light touch in Eli's voice, outcomes over duties ("achiever, not doer")
  without invented numbers, no bold or italics, and every technology linked.
  The guide is in the `get_resume` description and result. `rewrite`,
  `add_item` and `set_summary` reject bold and italics, and return `warnings`
  for unlinked technologies, filler words and rewrites that grow by more than
  40%. These checks apply only to agents, not to hand edits.
- `src/components/Resume/tools.ts`: the WebMCP tools (`get_resume`,
  `export_json_resume`, `get_changes`, `set_job_context`, `set_visibility`,
  `reorder`, `rewrite`, `set_summary`, `add_item`, `set_skill_keywords`,
  `highlight_keywords`, `revert_change`, `reset_tailoring`, `get_print_layout`,
  `set_print_options`, `get_share_url`, `open_print_dialog`). Each is plain data
  with an `execute` that returns JSON or throws; `ResumeTools` registers them
  with [`usewebmcp`](https://www.npmjs.com/package/usewebmcp).

## Hand edits

The pencil button next to the download button, or a `/resume/#edit` link,
loads `TailoredResume` in edit mode. You can also turn it on with "Edit text"
in the panel. In edit mode, `Rich` renders each editable piece of text
(bullets, summaries, skill lines, activities, section titles) as
`contenteditable="plaintext-only"`. Focusing it shows its markdown, and leaving
it, or pressing Enter, saves it with `addManualEdit()`. Escape cancels. A hand
edit is a `rewrite` change marked `manual`, so it appears in the change log
(with a "by hand" badge), can be reverted and is saved in the link. Editing the
same text again straight away updates that change instead of adding another.
Shared links drop `edit` from the hash, so they open read-only.

preact/compat listens for `focusin`/`focusout` rather than `focus`/`blur`, so
the tests dispatch those.

## Print layout

`get_print_layout` (`src/lib/resumeTailor/layout.ts`) clones the page into an
off-screen iframe the size of a sheet of paper, copies the page's
`@media print` rules into an `@media all` block so they apply there, and
simulates Chrome's pagination. It reports which blocks start each page, jobs
pushed to the next page, blocks split across pages, headings stranded at the
bottom of a page, and blocks running under the fixed print footer. The page
size and margins are defined once in `PAGE` there, which also emits the
`@page` rule for `/resume/`.

## Tests

- `pnpm test`: model, state, serialization and pagination unit tests, plus
  Testing Library component tests in `src/components/Resume/*.test.tsx` that
  drive the WebMCP tools through a stubbed `document.modelContext`.
- `tests/e2e/resume-tailor.spec.ts` (Playwright `webmcp` project) runs in
  Google Chrome with `--enable-features=WebMCP` (tested with Chrome 154; 141
  doesn't have WebMCP). It calls the
  tools the way an agent does, through Chrome's own `document.modelContext`
  (`getTools()` / `executeTool()`), and covers hydration, a tailored link
  surviving a reload, and `get_print_layout` matching real `page.pdf()` page
  counts. Install Chrome with `pnpm exec playwright install chrome`, or point
  `PLAYWRIGHT_WEBMCP_CHROME_PATH` at another build such as Chrome for Testing.

`/resume/` carries a WebMCP origin trial token, so Chrome enables WebMCP on
`https://eligundry.com` without the flag until the token expires (2026-11-17).
