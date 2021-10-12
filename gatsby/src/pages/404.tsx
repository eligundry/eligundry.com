import React from 'react'
import Helmet from 'react-helmet'
import { PageProps } from 'gatsby'

import Layout from '../layout'
import Paper from '../components/Shared/Paper'

const ErrorPage: React.FC<PageProps> = ({ path }) => (
  <Layout>
    <Helmet>
      <title>Whoops!</title>
    </Helmet>
    <Paper>
      <h1>Whoops!</h1>
      <p>
        We couldn't find a page called <code>{path}</code>!
      </p>
      <img
        src="https://http.cat/404.jpg"
        alt="HTTP Status Cat for 404 status code"
      />
    </Paper>
  </Layout>
)

export default ErrorPage
