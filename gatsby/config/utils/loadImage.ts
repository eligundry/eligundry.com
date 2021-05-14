import type { Node, Actions } from 'gatsby'
import { createRemoteFileNode, CreateRemoteFileNodeArgs } from 'gatsby-source-filesystem'

interface LoadImageArgs extends CreateRemoteFileNodeArgs {
  cacheKey: string
  node: Node
  targetNodeKey: string
  touchNode: Actions['touchNode']
}

const loadImage = async (args: LoadImageArgs) => {
  const { 
    cacheKey, 
    node, 
    targetNodeKey, 
    touchNode, 
    cache, 
    ...createRemoteFileNodeArgs
  } = args

  const cachedImage = await cache.get(cacheKey)

  if (
    cachedImage && 
    cachedImage.fileNodeID &&
    cachedImage?.modified && 
    node?.modified && 
    cachedImage.modified === node.modified
  ) {
    touchNode({ nodeId: cachedImage.fileNodeID })
    node[`${targetNodeKey}___NODE`] = cachedImage.id
    return
  }

  const imageNode = await createRemoteFileNode({
    cache,
    ...createRemoteFileNodeArgs,
  })

  if (imageNode) {
    node[`${targetNodeKey}___NODE`] = imageNode.id

    await cache.set(cacheKey, {
      fileNodeID: imageNode.id,
      modified: node.modified ?? 1,
    })
  }
}

export default loadImage
