import { BskyAgent, RichText } from '@atproto/api'
import trim from 'lodash/trim'
import { dedent } from './utils'

async function sendPost(text: string, extra?: any) {
  const agent = new BskyAgent({ service: 'https://bsky.social' })
  const richText = new RichText({
    text: dedent(trim(text.slice(0, 300), ' \n')),
  })

  await agent.login({
    identifier: process.env.BLUESKY_USERNAME,
    password: process.env.BLUESKY_PASSWORD,
  })
  await agent.post({
    ...extra,
    text: richText.text,
    facets: richText.facets,
  })
}

const api = { sendPost }

export default api
