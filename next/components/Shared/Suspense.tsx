import React from 'react'

const isSSR = typeof window === 'undefined'

const Suspense: React.FC<React.SuspenseProps> = (props) => {
  if (isSSR) {
    return null
  }

  return <React.Suspense {...props} />
}

export default Suspense
