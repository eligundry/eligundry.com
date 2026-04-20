import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getCollection } from 'astro:content'
import * as dateFns from 'date-fns'
import type { LastFMCoverItem, LastFMPeriod } from '../lastfm'
import daylio from '../daylio'

export interface PostGenerationContext {
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

export function buildSystemPrompt(context: PostGenerationContext): string {
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
- Keep it under 280 characters
- Sound like Eli, not a corporate brand
- No hashtags
- One emoji maximum, only if it fits naturally
`

  return prompt
}

export async function getPostContext(
  albums: LastFMCoverItem[],
  period: LastFMPeriod
): Promise<PostGenerationContext> {
  // Get last 7 days of Daylio notes
  const sevenDaysAgo = dateFns.subDays(new Date(), 7)
  const feelings = await daylio.getAll({ start: sevenDaysAgo, limit: 20 })
  const recentNotes = feelings.flatMap((f) => f.notes ?? []).slice(0, 10)

  // Get latest blog post
  const posts = await getCollection('blog')
  const publishedPosts = posts.filter((p) => !p.data.draft)
  const latestPost = publishedPosts.sort((a, b) =>
    dateFns.compareDesc(a.data.date, b.data.date)
  )[0]

  return {
    albums,
    period,
    daylioNotes: recentNotes,
    latestBlogPost: latestPost
      ? {
          title: latestPost.data.title,
          description: latestPost.data.description,
          date: latestPost.data.date,
          slug: latestPost.slug,
        }
      : null,
  }
}

function getLastFmUrl(period: '7day' | '1month' | '12month'): string {
  const now = new Date()
  const urls = {
    '7day': `https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}/week/${dateFns.getWeek(now)}`,
    '1month': `https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}/month/${now.getMonth() + 1}`,
    '12month': `https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}`,
  }
  return urls[period]
}

export async function generatePostText(
  albums: LastFMCoverItem[],
  period: '7day' | '1month' | '12month'
): Promise<string> {
  const context = await getPostContext(albums, period)
  const systemPrompt = buildSystemPrompt(context)
  const lastFmUrl = getLastFmUrl(period)

  const { text } = await generateText({
    model: openai('gpt-5.2'),
    system: systemPrompt,
    prompt: `Write a post sharing my music listening for ${periodLabels[period]}. Use {{LASTFM_URL}} as the link placeholder.`,
    maxOutputTokens: 200,
  })

  // Replace placeholder with actual URL
  return text.replace('{{LASTFM_URL}}', lastFmUrl)
}
