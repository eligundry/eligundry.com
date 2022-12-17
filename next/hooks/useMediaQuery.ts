import useMedia from 'react-use/lib/useMedia'
import useTailwindTheme, { Theme } from './useTailwindTheme'

type Query = string | ((query: Theme) => string)

console.log({ useMedia })

export default function useMediaQuery(query: Query, defaultState?: boolean) {
  const theme = useTailwindTheme()

  if (typeof query === 'function') {
    query = query(theme)
  }

  return useMedia(query, defaultState)
}

export function useIsPrinting() {
  return useMediaQuery('print', false)
}

export function useIsMobile(defaultState = false) {
  return useMediaQuery(
    (theme) => `(max-width: ${theme.screens.sm.max})`,
    defaultState
  )
}

export function useIsPhone(defaultState = false) {
  return useMediaQuery(
    (theme) => `(max-width: ${theme.screens.xs.max})`,
    defaultState
  )
}

export function useHasTouch(defaultState = false) {
  return useMediaQuery('(hover: none)', defaultState)
}
