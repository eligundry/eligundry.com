import type { AppProps } from 'next/app'

import Layout from '@/components/Layout'

import 'tailwindcss/dist/base.min.css'
import 'react-loading-skeleton/dist/skeleton.css'
import '@/components/Layout/fonts.css'
import '@/components/Layout/prism-material.scss'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
