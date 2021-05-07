import useMedia from 'react-use/lib/useMedia'

export default function useIsMobile() {
  return useMedia('(max-width: 1023px)')
}
