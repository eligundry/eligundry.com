import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { useEffectOnce } from 'react-use'

import Layout from '../layout'

const ErrorPage: React.FC = () => {
  const [statusCode, setStatusCode] = useState<number | null>(null)

  useEffectOnce(() => {
    window
      .fetch(window.location.href)
      .then(resp => setStatusCode(resp.status === 200 ? 404 : resp.status))
  })

  return (
    <Layout>
      <Helmet>
        <title>Whoops!</title>
      </Helmet>
      {statusCode && (
        <main>
          <h1>Whoops!</h1>
          <p>
            We couldn't find a page called{' '}
            <code>{window.location.pathname}</code>!
          </p>
          <img
            src={`https://http.cat/${statusCode}.jpg`}
            alt={`HTTP Status Cat for ${statusCode} status code`}
          />
        </main>
      )}
    </Layout>
  )
}

export default ErrorPage
