import React from 'react'
import Helmet from 'react-helmet'

const Head: React.FC = () => (
  <Helmet>
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="true"
    />
    {/*
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400&display=swap"
      rel="stylesheet"
    />
    */}
  </Helmet>
)

export default Head
