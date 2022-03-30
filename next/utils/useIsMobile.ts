import { theme } from 'twin.macro'
import useMedia from 'react-use/lib/useMedia'

export default function useIsMobile(defaultState = false) {
  return useMedia(`(max-width: ${theme`screens.sm.max`})`, defaultState)
}

export function useIsPhone(defaultState = false) {
  return useMedia(`(max-width: ${theme`screens.xs.max`})`, defaultState)
}

export function useHasTouch(defaultState = false) {
  return useMedia('(hover: none)', defaultState)
}
