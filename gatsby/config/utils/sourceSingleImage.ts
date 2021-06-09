import { SourceNodesArgs } from 'gatsby'

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
    ...image,
  })
}

export default sourceSingleImage
