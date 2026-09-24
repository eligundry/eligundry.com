import retry from 'async-retry'
import { getAverageColor } from 'fast-average-color-node'

/**
 * Average color of the image at `url`, or null if it can't be fetched.
 * Retries a few times since image CDNs (Last.fm's especially) intermittently
 * fail requests for images that do exist.
 */
export const averageColorFromURL = async (url: string) => {
  try {
    return await retry(async () => (await getAverageColor(url)).hex, {
      retries: 3,
      minTimeout: 500,
    })
  } catch (e) {
    console.warn(`could not fetch avg color for image ${url}`, e)
    return null
  }
}
