import {
  createRemoteFileNode,
  CreateRemoteFileNodeArgs,
} from 'gatsby-source-filesystem'

interface LoadImageArgs extends CreateRemoteFileNodeArgs {
  cacheKey?: string
}

const loadImage = async (args: LoadImageArgs) => {
  const { cacheKey, cache, ...createRemoteFileNodeArgs } = args

  if (cacheKey) {
    const cachedImage = await cache.get(cacheKey)

    if (cachedImage && cachedImage.fileNodeID) {
      return cachedImage
    }
  }

  const imageNode = await createRemoteFileNode({
    cache,
    ...createRemoteFileNodeArgs,
  })

  if (imageNode && cacheKey) {
    await cache.set(cacheKey, {
      fileNodeID: imageNode.id,
      modified: imageNode.modifiedTime,
    })
  }

  return imageNode
}

export default loadImage
