import { useMemo } from 'react'
import useSearchParam from 'react-use/lib/useSearchParam'

export function useParseOptimizedFlag(): boolean {
  return !!useSearchParam('parse-optimized')
}

interface UseJobSearchParams {
  source?: string
  medium?: string
  content?: string
}

export function useJobSearchParams({
  source = 'job-application',
  medium = 'resume',
  content = 'view-full-resume',
}: UseJobSearchParams) {
  const company = useSearchParam('company')
  const contactName = useSearchParam('contact-name')

  const targetParams = useMemo(() => {
    const p = new URLSearchParams({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: company ?? contactName ?? 'none',
      utm_content: content,
    })

    if (company) {
      p.set('utm_term', 'company')
    } else if (contactName) {
      p.set('utm_term', 'person')
    }

    return p
  }, [source, medium, content, company, contactName])

  return targetParams
}

export function useFullResumeToggle(): boolean {
  return !!useSearchParam('full')
}
