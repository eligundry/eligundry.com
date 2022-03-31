import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import Head from 'next/head'
import tw, { styled, theme } from 'twin.macro'
import { FaSync } from 'react-icons/fa'
import { isSSR } from '@/utils/env'
import useDocument from '@/components/Shared/useDocument'

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
          <Canvas seed={seed} />
          <RefreshButton
            onClick={() => setSeed(generateSeed())}
            title="Regenerate the background pattern"
            arial-label="Regenerate the background pattern"
            className="gtm-background-refresh-button"
          >
            <FaSync />
          </RefreshButton>
        </>
      )}
    </>
  )
}

const Canvas = styled.div<{ seed: number }>`
  --fluid-pattern-seed: ${(props) => props.seed};
  --fluid-pattern-bg-color: ${theme`colors.siteBackground`};
  --fluid-pattern-color-1: ${theme`colors.yellow`};
  --fluid-pattern-color-2: ${theme`colors.primary`};
  --fluid-pattern-color-3: ${theme`colors.red`};
  --fluid-pattern-color-4: ${theme`colors.green`};

  .dark & {
    --fluid-pattern-bg-color: ${theme`colors.black`};
  }

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: paint(fluidPattern);
  z-index: -100000;

  ${tw`print:hidden`}
`

const RefreshButton = styled.button`
  font-size: 2rem;
  z-index: 10;

  ${tw`
    fixed 
    bottom-4 
    right-4 
    rounded-full 
    bg-primary 
    hover:bg-primaryLite
    text-white 
    p-4
    sm:text-base
    sm:p-2
    print:hidden
  `}
`

export default FancyBackground
