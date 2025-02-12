import * as bsky from '@atproto/api'
import trim from 'lodash/trim'
import { dedent } from './utils'

const { BskyAgent, RichText } = bsky

async function getAgent() {
  const agent = new BskyAgent({ service: 'https://bsky.social' })
  await agent.login({
    identifier: import.meta.env.BLUESKY_USERNAME,
    password: import.meta.env.BLUESKY_PASSWORD,
  })

  return agent
}

async function sendPost(text: string, extra?: any) {
  const agent = await getAgent()
  const richText = new RichText({
    text: dedent(trim(text, ' \n')),
  })
  await richText.detectFacets(agent)

  await agent.post({
    ...extra,
    text: richText.text,
    facets: richText.facets,
  })
}

async function uploadImage(image: Buffer, encoding: string) {
  const agent = await getAgent()
  return agent.uploadBlob(image.toString(), {
    encoding: encoding,
  })
}

const api = { getAgent, sendPost, uploadImage }

export default api
