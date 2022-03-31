import canvas from 'canvas'
import colorThief from 'color-thief-node'

const getPlaceholderForImage = async (imageURL: string): Promise<string> => {
  const dominantColor = await colorThief
    .getColorFromURL(imageURL)
    .then((rgb) => `rgb(${rgb.join(', ')})`)
  const can = canvas.createCanvas(1, 1)
  const ctx = can.getContext('2d')
  ctx.fillStyle = dominantColor
  ctx.fillRect(0, 0, 1, 1)

  return `data:image/png;base64,${can.toBuffer('image/png').toString('base64')}`
}

const api = { getPlaceholderForImage }

export default api
