import React from 'react'

const isSSR = typeof window === 'undefined'

const GatsbySuspense: React.FC<React.SuspenseProps> = props => {
  if (isSSR) {
    return null
  }

  return <React.Suspense {...props} />
}

export default GatsbySuspense
