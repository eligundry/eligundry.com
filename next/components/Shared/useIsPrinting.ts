import useMedia from 'react-use/lib/useMedia'

export default function useIsPrinting() {
  return useMedia('print', false)
}
