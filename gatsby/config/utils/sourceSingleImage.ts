import { SourceNodesArgs } from 'gatsby'
import loadImage from './loadImage'

const sourceSingleImage = async (
  args: SourceNodesArgs,
  imageURL: string,
  name: string
) => {
  const {
    createNodeId,
    createContentDigest,
    actions: { createNode },
  } = args
  const image = {
    url: imageURL,
    name,
  }

  const imageNode = await loadImage({
    cacheKey: `downloaded-image-${name}`,
    url: imageURL,
    ext: '.jpg',
    createNode,
    ...args,
  })

  createNode({
    id: createNodeId(
      `downloaded-image-${Buffer.from(imageURL).toString('base64')}`
    ),
    parent: null,
    children: [],
    internal: {
      type: 'DownloadedImage',
      content: JSON.stringify(image),
      contentDigest: createContentDigest(image),
    },
    image: imageNode.id,
    ...image,
  })
}

export default sourceSingleImage
