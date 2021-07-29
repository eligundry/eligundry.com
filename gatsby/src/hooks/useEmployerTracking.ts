import { useEffect } from 'react'
import useSearchParam from 'react-use/lib/useSearchParam'
import useSessionStorage from 'react-use/lib/useSessionStorage'

export default function useEmployerTracking() {
  const employerUTM = useSearchParam('utm_campaign')
  const [employerName, setEmployerName] = useSessionStorage<string>(
    'employerName'
  )

  useEffect(() => {
    if (employerUTM && employerUTM.startsWith('employer-')) {
      setEmployerName(employerUTM.replace('employer-', ''))
    }
  }, [employerUTM, setEmployerName])

  return employerName
}

interface UseEmployerTracking {
  utm_source: string
  utm_medium: string
}

export function useEmployerTargeting({
  utm_medium,
  utm_source,
}: UseEmployerTracking) {
  const targetedEmployer = useSearchParam('employer') || 'none'
  const targeting = new URLSearchParams({
    utm_source,
    utm_medium,
    utm_campaign: `employer-${targetedEmployer}`,
  })

  return targeting
}
