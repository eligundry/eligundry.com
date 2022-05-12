import { getPlaiceholder } from 'plaiceholder'
import { cacheAxios } from './axios'

const getPlaceholderForImage = async (imageURL: string): Promise<string> =>
  cacheAxios
    .get(imageURL, { responseType: 'arraybuffer' })
    .then((resp) => getPlaiceholder(Buffer.from(resp.data, 'binary')))
    .then(({ base64 }) => base64)

const api = { getPlaceholderForImage }

export default api
