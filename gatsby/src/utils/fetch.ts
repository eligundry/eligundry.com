import Cookies from 'js-cookie'
import parseISO from 'date-fns/parseISO'

export default function fetch(input: RequestInfo, init: RequestInit = {}) {
  const options: RequestInit = {
    credentials: 'omit',
    ...init,
  }
  const basicAuth = Cookies.get('admin_auth')

  if (basicAuth) {
    options.headers = {
      Authorization: `Basic ${basicAuth}`,
    }
  }

  return window.fetch(input, options)
}

const dateKeys = Object.freeze(['time', 'created_at'])

export async function processResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  const data: T = JSON.parse(text, (key, value) => {
    if (typeof value === 'string' && dateKeys.includes(key)) {
      return parseISO(value)
    }

    return value
  })

  if (!response.ok) {
    throw new Error(text)
  }

  return data
}
