import { getAverageColor } from 'fast-average-color-node'
import { cache } from './cache'

export const averageColorFromURL = async (url: string) => {
  const key = `avgColor[${url}]`
  let color = cache.get<string>(key)

  if (color) {
    return color
  }

  try {
    color = (await getAverageColor(url)).hex
  } catch (e) {
    console.warn(`could not fetch avg color for image ${url}`, e)
    return null
  }

  cache.set(key, color)

  return color
}
