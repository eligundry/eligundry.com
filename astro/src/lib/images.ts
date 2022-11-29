import { getAverageColor } from 'fast-average-color-node'
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

  await c.set(key, color, 60 * 60 * 24 * 50000)

  return color
}
