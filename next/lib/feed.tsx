import fs from 'fs'
import { Feed } from 'feed'
import * as dateFns from 'date-fns'
import config from '@/utils/config'
import ReactDOMServer from 'react-dom/server'
import { getMDXComponent } from 'mdx-bundler/client'
import { MDXShortcodesForFeed } from '@/components/Post/shortcodes'

import daylio from './daylio'
import blog from './blog'

export const generateBlogFeed = async () => {
  const entries = blog.getAll('blog')
  const author = {
    name: 'Eli Gundry',
    email: 'eligundry@gmail.com',
    link: 'https://eligundry.com',
  }
  const feed = new Feed({
    title: 'Eli Gundry',
    description: config.siteDescription,
    id: 'https://eligundry.com',
    link: 'https://eligundry.com/blog',
    language: 'en-US',
    copyright: `${new Date().getFullYear()} Eli Gundry`,
    feedLinks: 'https://eligundry.com/blog.rss',
    author,
  })

  entries
    .sort((a, b) =>
      dateFns.compareDesc(dateFns.parseISO(a.date), dateFns.parseISO(b.date))
    )
    .forEach((post) => {
      const Component = getMDXComponent(post.body.code)

      feed.addItem({
        title: post.title,
        date: new Date(post.date),
        link: config.siteUrl + post.path,
        description: post.description,
        content: ReactDOMServer.renderToStaticMarkup(
          <Component components={MDXShortcodesForFeed} />
        ),
        category: post.tags?.map((category) => ({
          name: category,
        })),
      })
    })

  await fs.promises.writeFile('public/blog.rss', feed.rss2(), {
    encoding: 'utf8',
  })
}

export const generateDaylioFeed = async () => {
  const entries = await daylio.getAll()
  const author = {
    name: 'Eli Gundry',
    email: 'eligundry@gmail.com',
    link: 'https://eligundry.com/feelings',
  }
  const feed = new Feed({
    title: "Eli Gundry's Feelings",
    description: "A daily journal of how I'm feeling",
    id: 'https://eligundry.com/feelings',
    link: 'https://eligundry.com/feelings',
    language: 'en-US',
    copyright: `${new Date().getFullYear()} Eli Gundry`,
    author,
  })

  entries.forEach((entry) => {
    const difference = dateFns.differenceInCalendarDays(
      new Date(),
      dateFns.parseISO(entry.time)
    )
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
      id: `https://eligundry.com/feelings#${entry.time}`,
      link: `https://eligundry.com/feelings#${entry.time}`,
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

  await fs.promises.writeFile('public/feelings.rss', feed.rss2(), {
    encoding: 'utf8',
  })
}
