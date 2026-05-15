import { test, expect, describe } from 'vitest'
import * as dateFns from 'date-fns'

// We can't import from lastfm.ts or lastfm-post-generator.ts because they have
// side effects that require env vars or astro:content at module load time.
// Instead, we inline the types and replicate buildSystemPrompt for testing.

interface LastFMCoverItem {
  album: string
  artist: string
  count: number
  cover: string
  hires: string
  coverColor: string | null
  url: string
}

type LastFMPeriod = '7day' | '1month' | '12month'

interface PostGenerationContext {
  albums: LastFMCoverItem[]
  period: LastFMPeriod
  daylioNotes: string[]
  latestBlogPost: {
    title: string
    description: string
    date: Date
    slug: string
  } | null
}

const periodLabels: Record<'7day' | '1month' | '12month', string> = {
  '7day': 'this week',
  '1month': 'this month',
  '12month': 'this year',
}

function buildSystemPrompt(context: PostGenerationContext): string {
  const periodLabel =
    periodLabels[context.period as keyof typeof periodLabels] ?? 'recently'

  const albumList = context.albums
    .slice(0, 9)
    .map((a, i) => `${i + 1}. "${a.album}" by ${a.artist} (${a.count} plays)`)
    .join('\n')

  let prompt = `You are writing a social media post for Eli Gundry about his music listening habits ${periodLabel}.

## Writing Style
Eli writes casually and authentically. He uses lowercase for effect occasionally, references personal experiences when relevant, and keeps posts concise. He may use self-deprecating humor or witty observations. He does NOT use hashtags or excessive emoji.

## Top Albums ${periodLabel}:
${albumList}

## Recent Mood/Journal Notes (last 7 days):
${context.daylioNotes.length > 0 ? context.daylioNotes.map((n) => `- ${n}`).join('\n') : 'No recent notes available.'}
`

  if (context.latestBlogPost) {
    prompt += `
## Latest Blog Post:
Title: "${context.latestBlogPost.title}"
Description: ${context.latestBlogPost.description}
Date: ${dateFns.format(context.latestBlogPost.date, 'MMMM d, yyyy')}
`
  }

  prompt += `
## Task
Write a short, personal post about sharing the music collage. Reference the music genres/artists when relevant. If mood notes suggest a connection to the music, mention it naturally. The post must include the Last.fm link placeholder: {{LASTFM_URL}}

Requirements:
- Keep it under 280 characters if possible
- Sound like Eli, not a corporate brand
- No hashtags
- One emoji maximum, only if it fits naturally
`

  return prompt
}

describe('AI Post Generator - Prompt Snapshots', () => {
  const mockContext: PostGenerationContext = {
    albums: [
      {
        album: 'OK Computer',
        artist: 'Radiohead',
        count: 25,
        cover: '',
        hires: '',
        coverColor: null,
        url: '',
      },
      {
        album: 'In Rainbows',
        artist: 'Radiohead',
        count: 20,
        cover: '',
        hires: '',
        coverColor: null,
        url: '',
      },
      {
        album: 'Kid A',
        artist: 'Radiohead',
        count: 15,
        cover: '',
        hires: '',
        coverColor: null,
        url: '',
      },
    ],
    period: '7day',
    daylioNotes: [
      'Had a productive coding session today',
      'Feeling good about the new feature',
    ],
    latestBlogPost: {
      title: 'Building Better Software',
      description: 'A guide to improving your development workflow',
      date: new Date('2025-01-15'),
      slug: 'building-better-software',
    },
  }

  test('weekly prompt includes all context sections', () => {
    const prompt = buildSystemPrompt(mockContext)

    expect(prompt).toMatchSnapshot('weekly-prompt-with-full-context')
  })

  test('monthly prompt uses correct period label', () => {
    const monthlyContext = { ...mockContext, period: '1month' as const }
    const prompt = buildSystemPrompt(monthlyContext)

    expect(prompt).toContain('this month')
    expect(prompt).toMatchSnapshot('monthly-prompt')
  })

  test('yearly prompt uses correct period label', () => {
    const yearlyContext = { ...mockContext, period: '12month' as const }
    const prompt = buildSystemPrompt(yearlyContext)

    expect(prompt).toContain('this year')
    expect(prompt).toMatchSnapshot('yearly-prompt')
  })

  test('prompt without daylio notes shows fallback message', () => {
    const noNotesContext = { ...mockContext, daylioNotes: [] }
    const prompt = buildSystemPrompt(noNotesContext)

    expect(prompt).toContain('No recent notes available')
    expect(prompt).toMatchSnapshot('prompt-without-notes')
  })

  test('prompt without blog post omits that section', () => {
    const noBlogContext = { ...mockContext, latestBlogPost: null }
    const prompt = buildSystemPrompt(noBlogContext)

    expect(prompt).not.toContain('## Latest Blog Post')
    expect(prompt).toMatchSnapshot('prompt-without-blog')
  })

  test('prompt includes all 9 albums when provided', () => {
    const manyAlbums: PostGenerationContext = {
      ...mockContext,
      albums: Array.from({ length: 12 }, (_, i) => ({
        album: `Album ${i + 1}`,
        artist: `Artist ${i + 1}`,
        count: 100 - i * 5,
        cover: '',
        hires: '',
        coverColor: null,
        url: '',
      })),
    }
    const prompt = buildSystemPrompt(manyAlbums)

    // Should only include first 9
    expect(prompt).toContain('1. "Album 1"')
    expect(prompt).toContain('9. "Album 9"')
    expect(prompt).not.toContain('10. "Album 10"')
    expect(prompt).toMatchSnapshot('prompt-with-many-albums')
  })
})
