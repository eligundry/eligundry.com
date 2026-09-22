# Resume tailoring (WebMCP) and `/resume.json`

The resume is built from one model that can be tailored to a job posting by an
in-browser AI agent through [WebMCP](https://github.com/webmachinelearning/webmcp).
The same model is published as [JSON Resume](https://jsonresume.org/schema) at
`/resume.json`.

## Content

| Source                                | Becomes                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/content/resumeExperiences/*.mdx` | `work` / `education`; each top-level list item is a highlight, paragraphs a summary                  |
| `src/content/resumeSkills.yaml`       | `skills`; rendered as "`lead` A, B, and C."                                                          |
| `src/content/resumeActivities.yaml`   | "Activities & Interests" bullets; `records` map to `projects`, `volunteer`, `awards`, `publications` |
| `src/lib/resume/basics.ts`            | `basics` (name, label, contact info), also used by the print header/footer                           |

`src/lib/resume/build.ts` turns the collections into a `ResumeSource` with a
stable id on everything (`chord`, `chord:0`, `chord:summary`, `skills:languages`,
`activities:talks`, `section:work`, `section:work:title`, `basics:summary`…).
`toSuperset()` produces JSON Resume plus `x-` extension keys, and
`toJsonResume()` strips the extensions and hidden entries for `/resume.json`.

## Tailoring

`/resume/` embeds the pristine `ResumeSource` as JSON. When the URL has a
`#t=` hash or the browser exposes `navigator.modelContext`, it loads
`src/lib/resumeTailor/runtime.ts`, which:

- replays the tailoring log (`state.ts`) over the pristine resume. Each change
  has a reason and can be reverted on its own.
- renders the result onto the static markup (`dom.ts`) using the
  `data-resume-id` / `data-resume-container` / `data-resume-text` attributes.
- stores the log, deflated, in the URL hash (`serialize.ts`). Links are
  shareable and nothing is stored on a server.
- registers the WebMCP tools (`webmcp.ts`): `get_resume`,
  `export_json_resume`, `get_changes`, `set_job_context`, `set_visibility`,
  `reorder`, `rewrite`, `set_summary`, `add_item`, `set_skill_keywords`,
  `highlight_keywords`, `revert_change`, `reset_tailoring`,
  `get_print_layout`, `set_print_options`, `get_share_url` and
  `open_print_dialog`.

Organization, position, dates and location can't be rewritten. Tailored text is
inline markdown rendered with all HTML escaped, because it can come from a
shared link. `TailorPanel.tsx` shows the change log, review mode (the original
next to each rewrite) and print tools.

## Print layout

`get_print_layout` (`layout.ts`) clones the tailored page into an off-screen
iframe that is sized like a sheet of paper, with `print:` styles switched on,
and simulates Chrome's pagination. It reports which blocks start each page,
jobs pushed to the next page, blocks split across pages, headings stranded at
the bottom of a page, and blocks running under the fixed print footer. Tailwind's
`print:` variant also matches `html[data-print-preview]` (see
`src/styles/tailwind.css`), which makes this possible.
`tests/e2e/resume-tailor.spec.ts` checks the estimate against a real
`page.pdf()`.
