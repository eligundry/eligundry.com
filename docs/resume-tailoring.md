# Resume tailoring (WebMCP) and `/resume.json`

`/resume/` is one Preact island rendered from a resume model. An in-browser AI
agent can tailor it to a job posting through
[WebMCP](https://github.com/webmachinelearning/webmcp). The same model is
published as [JSON Resume](https://jsonresume.org/schema) at `/resume.json`.

## Content

| Source                                | Becomes                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/content/resumeBasics.yaml`       | `basics` (name, label, tagline, contact info), also used by the print footer                         |
| `src/content/resumeExperiences/*.mdx` | `work` / `education`; each top-level list item is a highlight, paragraphs a summary                  |
| `src/content/resumeSkills.yaml`       | `skills`; rendered as "`lead` A, B, and C."                                                          |
| `src/content/resumeActivities.yaml`   | "Activities & Interests" bullets; `records` map to `projects`, `volunteer`, `awards`, `publications` |

`getResumeSource()` (`src/lib/resume/build.ts`) turns the collections into a
`ResumeSource` (`src/lib/resume/model.ts`) with a stable id on everything
(`chord`, `chord:0`, `chord:summary`, `skills:languages`, `activities:talks`,
`section:work`, `section:work:title`, `basics:summary`…). Text nodes carry their
markdown and its HTML, rendered by `src/lib/resume/markdown.ts` with micromark:
build-time content may contain inline HTML; tailored text is escaped.

`toSuperset()` produces JSON Resume plus `x-` extension keys, and
`toJsonResume()` strips the extensions and hidden entries for `/resume.json`.

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
- `src/components/Resume/tools.ts`: the WebMCP tools (`get_resume`,
  `export_json_resume`, `get_changes`, `set_job_context`, `set_visibility`,
  `reorder`, `rewrite`, `set_summary`, `add_item`, `set_skill_keywords`,
  `highlight_keywords`, `revert_change`, `reset_tailoring`, `get_print_layout`,
  `set_print_options`, `get_share_url`, `open_print_dialog`). Each is plain data
  with an `execute` that returns JSON or throws; `ResumeTools` registers them
  with [`usewebmcp`](https://www.npmjs.com/package/usewebmcp).

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
- `tests/e2e/resume-tailor.spec.ts` (Playwright): hydration, a tailored link
  surviving a reload, and `get_print_layout` matching real `page.pdf()` page
  counts.
