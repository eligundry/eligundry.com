import axios from 'axios'
import { GatsbyNode } from 'gatsby'

interface Feeling {
  time: string
  mood: string
  activities: string[]
  notes: string[]
}

const loadFeelings: GatsbyNode['sourceNodes'] = async ({
  createNodeId,
  createContentDigest,
  reporter,
  actions: { createNode },
}) => {
  const fetchTimer = reporter.activityTimer(
    '@eligundry/eligundry.com: Fetch feelings'
  )
  const createNodesTimer = reporter.activityTimer(
    '@eligundry/eligundry.com: createNodes for feelings'
  )

  fetchTimer.start()

  const resp = await axios.get<Feeling[]>(
    'https://8rlviipruj.execute-api.us-east-2.amazonaws.com/dev/api/feelings'
  )

  fetchTimer.end()
  createNodesTimer.start()

  resp.data.forEach((entry) =>
    createNode({
      id: createNodeId(`feeling-${entry.time}`),
      parent: null,
      children: [],
      internal: {
        type: 'Feeling',
        content: JSON.stringify(entry),
        contentDigest: createContentDigest(entry),
      },
      ...entry,
    })
  )

  createNodesTimer.end()
}

export default loadFeelings
