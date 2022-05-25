import { useRouter } from 'next/router'
import { useIsPrinting } from '@/hooks/useMediaQuery'

export default function useHideHeader() {
  const isPrinting = useIsPrinting()
  const { pathname } = useRouter()

  return isPrinting && pathname.startsWith('/resume')
}
