import { useMemo } from 'react'
import { isSSR } from '../../utils/env'

export default function useDocument(): Document | undefined {
  return useMemo(() => (!isSSR ? document : undefined), [isSSR])
}
