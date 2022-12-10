import path from 'node:path'
import fs from 'fs/promises'
import { promisify } from 'node:util'
import { getAverageColor } from 'fast-average-color-node'
import imageSize from 'image-size'
import { cache } from './cache'

export const averageColorFromURL = async (url: string) => {
  const key = `avgColor-${url}`
  const c = await cache
  let color = await c.get<string>(key)

  if (color) {
    return color
  }

  try {
    color = (await getAverageColor(url)).hex
  } catch (e) {
    console.warn(`could not fetch avg color for image ${url}`, e)
    return null
  }

  await c.set(key, color)

  return color
}

interface MdxImageData {
  aspectRatio: number
  backgroundColor: string
  width: number
}

export const getRemoteImageMetadata = async (urlOrPath: string) => {
  const c = await cache
  const key = `mdxImage-${urlOrPath}`
  let data = await c.get<MdxImageData>(key)

  if (data) {
    return data
  }

  let file: Buffer

  // Remote image
  if (urlOrPath.startsWith('http')) {
    file = await fetch(urlOrPath).then(async (resp) =>
      Buffer.from(await resp.arrayBuffer())
    )
  }
  // Image from the public directory
  else {
    file = await fs.readFile(path.join(process.cwd(), 'public', urlOrPath))
  }

  const backgroundColor = (await getAverageColor(file)).hex
  const dimensions = imageSize(file)

  if (!dimensions || !dimensions.width || !dimensions.height) {
    throw new Error(`could not get dimensions of image ${urlOrPath}`)
  }

  const aspectRatio = dimensions.width / dimensions.height
  data = {
    aspectRatio,
    backgroundColor,
    width: dimensions.width,
  }

  await c.set(key, data)

  return data
}
