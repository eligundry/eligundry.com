export const isSSR = typeof window === 'undefined'
export const isBrowser = !isSSR
