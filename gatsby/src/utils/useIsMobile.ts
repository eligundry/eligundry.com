import { theme } from 'twin.macro'
import useMedia from 'react-use/lib/useMedia'

export default function useIsMobile() {
  return useMedia(`(max-width: ${theme`screens.sm.max`})`)
}

export function useIsPhone() {
  return useMedia(`(max-width: ${theme`screens.xs.max`})`)
}

export function useHasTouch() {
  return useMedia('(hover: none)')
}
