import type { Nodes } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { markdownToPlain } from '../resume/markdown'
import type { Technology } from '../resume/technologies'
import { TailorError } from './state'

// How agents should write when tailoring the resume. Eli wants a tailored
// resume to still sound like Eli: a light touch, plain text, outcomes over
// duties and technologies linked the way the rest of the resume links them.

/** Words that make a resume read like every other AI-written resume. */
export const FILLER_WORDS = [
  'spearheaded',
  'leveraged',
  'leveraging',
  'synergy',
  'synergies',
  'results-driven',
  'passionate',
  'cutting-edge',
  'dynamic',
  'robust',
  'seamless',
  'seamlessly',
  'utilized',
  'best-in-class',
]

export const STYLE_GUIDE = `How to write on this resume:
1. Light touch. Prefer set_visibility, reorder and highlight_keywords over rewriting. Rewrite a bullet only when it already describes relevant work in different words, and keep its sentence shape, vocabulary and length (within about 20%). Don't add a summary or new bullets unless the user asks. Never stuff keywords, and never claim a technology or skill the original text doesn't support. If the resume doesn't match a requirement, leave the gap.
2. Match Eli's voice. Read the existing bullets first and write like them: plain words, one sentence, implied first person, past tense for past jobs. No corporate filler (${FILLER_WORDS.join(', ')}).
3. Achiever, not doer. Lead with the outcome, then how it happened ("Cut page load time 40% by moving to X", not "Responsible for X"). Only use numbers and outcomes already on the resume or given by the user. If a bullet has no outcome, leave it as is; never invent one.
4. No bold or italics. Plain text and links only.
5. Link technologies. Every technology named must be a markdown link. Use its URL from "x-technologies" when it's listed there, otherwise the technology's official homepage (Wikipedia only when there's no official site).`

function hasEmphasis(node: Nodes): boolean {
  if (node.type === 'strong' || node.type === 'emphasis') return true
  return 'children' in node && node.children.some(hasEmphasis)
}

/** The text of some markdown outside of links. */
function unlinkedText(node: Nodes): string {
  if (node.type === 'link' || node.type === 'linkReference') return ' '
  if ('value' in node && node.type !== 'html') return node.value
  if ('children' in node) {
    return node.children
      .map(unlinkedText)
      .join(node.type === 'root' ? '\n' : '')
  }
  return ' '
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const mentions = (text: string, term: string, flags = '') =>
  new RegExp(`(^|[^\\w])${escapeRegExp(term)}(?![\\w])`, flags).test(text)

/**
 * Checks markdown an agent wants to put on the resume. Throws for formatting
 * the resume never uses; returns warnings for things that are probably off.
 */
export function checkAgentMarkdown(
  markdown: string,
  {
    original,
    technologies = [],
  }: { original?: string; technologies?: Technology[] }
): string[] {
  const tree = fromMarkdown(markdown)
  if (hasEmphasis(tree)) {
    throw new TailorError(
      'Bold and italics are not allowed on this resume. Send the same text as plain text (links are fine).'
    )
  }

  const warnings: string[] = []
  const text = unlinkedText(tree)

  const unlinked = technologies
    .filter(({ name }) => name.length > 1 && mentions(text, name))
    .map(({ name, url }) => `${name} (${url})`)
  if (unlinked.length) {
    warnings.push(
      `Link these technologies: ${unlinked.join(', ')}. Every technology named on the resume is a link.`
    )
  }

  const filler = FILLER_WORDS.filter((word) => mentions(text, word, 'i'))
  if (filler.length) {
    warnings.push(
      `"${filler.join('", "')}" reads as filler. Use Eli's plain wording instead.`
    )
  }

  if (original) {
    const before = markdownToPlain(original).length
    const after = markdownToPlain(markdown).length
    if (before && after > before * 1.4) {
      warnings.push(
        `This is ${Math.round((after / before - 1) * 100)}% longer than the original. Keep rewrites close to the original length.`
      )
    }
  }

  return warnings
}
