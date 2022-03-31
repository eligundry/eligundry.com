import type { AppProps } from 'next/app'
import Script from 'next/script'

import Layout from '@/components/Layout'
import config from '@/utils/config'

import 'tailwindcss/dist/base.min.css'
import 'react-loading-skeleton/dist/skeleton.css'
import '@/components/Layout/fonts.css'
import '@/components/Layout/prism-material.scss'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Layout>
    <Script id="google-tag-manager">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${config.googleTagManagerID}');
      `}
    </Script>
    <Component {...pageProps} />
  </Layout>
)

export default MyApp
