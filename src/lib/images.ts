import { getAverageColor } from 'fast-average-color-node'

export const averageColorFromURL = async (url: string) => {
  try {
    const color = (await getAverageColor(url)).hex
    return color
  } catch (e) {
    console.warn(`could not fetch avg color for image ${url}`, e)
    return null
  }
}
