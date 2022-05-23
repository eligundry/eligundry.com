import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import Head from 'next/head'
import { FaSync } from 'react-icons/fa'
import { isSSR } from '@/utils/env'
import useDocument from '@/components/Shared/useDocument'
import clsx from 'clsx'
import styles from './index.module.scss'

// Borrowed from https://codepen.io/georgedoescode/pen/YzxrRZe
const generateSeed = () => Math.random() * 10000
const workletURL =
  'https://unpkg.com/@georgedoescode/fluid-pattern-worklet@1.0.1/worklet.bundle.js'

const FancyBackground: React.FC = () => {
  const document = useDocument()
  const [seed, setSeed] = useState(
    !isSSR && window?.CSS?.paintWorklet ? generateSeed() : undefined
  )

  useEffect(() => {
    if (document) {
      document.body.setAttribute('data-fancy-background', seed ? 'true' : '')
    }
  }, [document, seed])

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href={new URL(workletURL).origin}
          crossOrigin="true"
        />
      </Head>
      <Script id="fancy-background-paintWorklet">
        {`
          if (CSS && CSS.paintWorklet && CSS.paintWorklet.addModule) {
            CSS.paintWorklet.addModule('${workletURL}')
          }
        `}
      </Script>
      {seed && (
        <>
          <div
            style={{
              // @ts-ignore
              '--fluid-pattern-seed': seed,
            }}
            className={styles.canvas}
          />
          <button
            onClick={() => setSeed(generateSeed())}
            title="Regenerate the background pattern"
            arial-label="Regenerate the background pattern"
            className={clsx(
              'gtm-background-refresh-button',
              styles.refreshButton
            )}
          >
            <FaSync />
          </button>
        </>
      )}
    </>
  )
}

export default FancyBackground
