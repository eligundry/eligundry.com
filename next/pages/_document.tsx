// This code prevents a Flash Of Unstyled Content (FOUC)
// on load. Without it, the styles are only added once
// react loads on the frontend

import Document, { Html, Head, Main, NextScript } from 'next/document'
import clsx from 'clsx'

export default class MyDocument extends Document {
  render() {
    return (
      <Html
        lang="en"
        itemScope
        itemType="https://schema.org/Person"
        itemID="#eli-gundry"
        className={clsx(
          'wf-firacode-n4-loading',
          'wf-zillaslab-n4-loading',
          'wf-firasans-n4-loading',
          'wf-loading'
        )}
      >
        <Head>
          <meta itemProp="image" content="/img/eli-gundry-headshot.jpg" />
          <script
            data-partytown-config
            dangerouslySetInnerHTML={{
              __html: `
              partytown = {
                lib: "/_next/static/~partytown/",
                debug: true,
                forward: ['dataLayer.push']
              };
            `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
