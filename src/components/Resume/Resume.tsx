import { useEffect, useState, type ComponentType } from 'preact/compat'
import type { ResumeSource } from '../../lib/resume/model'
import { hasTailoringLink } from '../../lib/resumeTailor/hash'
import ResumeView from './ResumeView'

type TailoredResumeType = ComponentType<{ source: ResumeSource }>

/**
 * The resume island. It renders the plain resume, and swaps in the tailoring
 * version (loaded on demand) for tailored links or when the browser supports
 * WebMCP, so other visitors don't download it.
 */
export default function Resume({ source }: { source: ResumeSource }) {
  const [TailoredResume, setTailoredResume] = useState<TailoredResumeType>()

  useEffect(() => {
    const modelContext = document.modelContext ?? navigator.modelContext
    if (modelContext || hasTailoringLink(location.hash)) {
      import('./TailoredResume').then((module) =>
        setTailoredResume(() => module.default)
      )
    }
  }, [])

  return TailoredResume ? (
    <TailoredResume source={source} />
  ) : (
    <ResumeView resume={source} />
  )
}
