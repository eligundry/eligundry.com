import React, { useState } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import tw, { styled, theme } from 'twin.macro'
import { FaSync } from 'react-icons/fa'

// Stolen from https://codepen.io/georgedoescode/pen/YzxrRZe

const Canvas = styled.div<{ seed: number }>`
  --fluid-pattern-seed: ${(props) => props.seed};
  --fluid-pattern-bg-color: ${theme`colors.siteBackground`};
  --fluid-pattern-color-1: #ffd53d;
  --fluid-pattern-color-2: ${theme`colors.primary`};
  --fluid-pattern-color-3: #f25c54;
  --fluid-pattern-color-4: #48cb8a;

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
`

const RefreshButton = styled.button`
  ${tw`
    fixed 
    bottom-4 
    right-4 
    rounded-full 
    bg-primary 
    hover:bg-primaryLite
    text-white 
    p-4
  `}

  font-size: 2rem;
  z-index: 10;
`

const generateSeed = () => Math.random() * 10000

const FancyBackground: React.FC = () => {
  const [seed, setSeed] = useState<number | undefined>(undefined)

  useEffectOnce(() => {
    if (CSS?.paintWorklet?.addModule) {
      CSS?.paintWorklet?.addModule?.(
        'https://unpkg.com/@georgedoescode/fluid-pattern-worklet'
      )
      setSeed(generateSeed())
    }
  })

  if (!seed) {
    return null
  }

  return (
    <>
      <Canvas seed={seed} />
      <RefreshButton
        onClick={() => setSeed(generateSeed())}
        tabIndex={99999}
        title="Regenerate the background pattern"
        arial-label="Regenerate the background pattern"
        className="gtm-background-refresh-button"
      >
        <FaSync />
      </RefreshButton>
    </>
  )
}

export default FancyBackground
