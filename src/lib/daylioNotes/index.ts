import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri'
import mdastStripPrivate from '../satteri/mdast-strip-private'
import hastAccessibleEmojis from '../satteri/hast-accessible-emojis'
import { stripPrivateLines } from './stripPrivateLines'

// Sätteri loads a native binding, so this module is only imported lazily from
// build-time code paths (see daylio.getAll).
const markdownProcessor = await createSatteriMarkdownProcessor({
  mdastPlugins: [mdastStripPrivate],
  hastPlugins: [hastAccessibleEmojis],
})

export const renderNote = async (
  raw: string
): Promise<{ markdown: string; html: string } | null> => {
  const markdown = stripPrivateLines(raw)

  if (!markdown) return null

  return {
    markdown,
    html: (await markdownProcessor.render(markdown)).code,
  }
}
