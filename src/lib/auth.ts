import basicAuth from 'basic-auth'

const check = (authorizationHeader: string | null): boolean => {
  if (!authorizationHeader) {
    return false
  }

  const credentials = basicAuth.parse(authorizationHeader)

  if (!credentials) {
    return false
  }

  if (
    credentials.name === process.env.BASIC_AUTH_USERNAME &&
    credentials.pass === process.env.BASIC_AUTH_PASSWORD
  ) {
    return true
  }

  return false
}

const api = { check }

export default api
