/**
 * Save every year of GitHub contributions to the github_contributions table.
 * Builds only save the last year, so run this once to keep the years before
 * it. Safe to re-run: a day only ever keeps its highest count.
 *
 * Run with:  pnpm github:backfill
 * Reaches D1 with the Cloudflare credentials in .env.secrets.
 */
import config from '../../src/config'
import { fetchContributions, saveContributions } from '../../src/lib/github'

const days = await fetchContributions(config.github, 'all')
await saveContributions(days)

const total = days.reduce((sum, day) => sum + day.count, 0)
console.log(
  `Saved ${days.length} days from ${days[0]?.date} to ${days.at(-1)?.date}, ${total} contributions`
)
