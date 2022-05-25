import { useMemo } from 'react'
import { isSSR } from '@/utils/env'

export default function useDocument(): Document | undefined {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  return useMemo(() => (!isSSR ? document : undefined), [isSSR])
}
