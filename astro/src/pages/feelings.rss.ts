import type { APIRoute } from 'astro'
import { Feed } from 'feed'
import { utcToZonedTime } from 'date-fns-tz'
import daylio, { colloquialDifferenceInDays } from '../lib/daylio'
import { insertPrettyFeed } from '../lib/utils'
import config from '../config'

export const get: APIRoute = async () => {
  const entries = await daylio.getAll()
  const author = {
    name: 'Eli Gundry',
    email: 'eligundry@gmail.com',
    link: 'https://eligundry.com/feelings',
  }
  const feed = new Feed({
    title: "Eli Gundry's Feelings",
    description: "A daily journal of how I'm feeling.",
    id: 'https://eligundry.com/feelings/',
    link: 'https://eligundry.com/feelings/',
    language: 'en-US',
    copyright: `${new Date().getFullYear()} Eli Gundry`,
    author,
    updated: entries[0].time,
  })

  const now = utcToZonedTime(new Date(), 'America/New_York')

  entries.forEach((entry) => {
    const difference = colloquialDifferenceInDays(now, entry.time)
    let title = `I felt ${entry.mood}`

    if (difference === 0) {
      title = `Today, ${title}`
    } else if (difference === 1) {
      title = `Yesterday, ${title}`
    } else if (difference <= 7) {
      title = `${difference} days ago, ${title}`
    }

    feed.addItem({
      title,
      author: [author],
      id: `${config.url}/feelings#${entry.rawTime}`,
      link: `${config.url}/feelings#${entry.rawTime}`,
      date: new Date(entry.time),
      content: `
        <ul>
          ${
            entry.notes?.map((note) => `<li>${note}</li>`).join('\n') ??
            `<li>No notes!</li>`
          }
        </ul>
      `,
    })
  })

  return {
    body: insertPrettyFeed(feed.rss2()),
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  }
}
