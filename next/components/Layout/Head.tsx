import React, { useEffect } from 'react'
import Head from 'next/head'

const FontHead = () => {
  useEffect(() => {
    import('webfontloader').then((WebFont) =>
      WebFont.load({
        custom: {
          families: ['Fira Code', 'Fira Sans', 'Zilla Slab'],
        },
      })
    )
  }, [])

  return (
    <Head>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
    </Head>
  )
}

export default FontHead
