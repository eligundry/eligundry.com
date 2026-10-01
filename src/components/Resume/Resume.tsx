import { useEffect, useState, type ComponentType } from 'preact/compat'
import type { ResumeSource } from '../../lib/resume/model'
import { hasEditLink, hasTailoringLink } from '../../lib/resumeTailor/hash'
import ResumeView from './ResumeView'

type TailoredResumeType = ComponentType<{
  source: ResumeSource
  editing?: boolean
}>

/**
 * The resume island. It renders the plain resume, and swaps in the tailoring
 * version (loaded on demand) for tailored links, for editing or when the
 * browser supports WebMCP, so other visitors don't download it.
 */
export default function Resume({ source }: { source: ResumeSource }) {
  const [TailoredResume, setTailoredResume] = useState<TailoredResumeType>()
  const [editing, setEditing] = useState(false)

  const load = () =>
    import('./TailoredResume').then((module) =>
      setTailoredResume(() => module.default)
    )

  const startEditing = () => {
    setEditing(true)
    void load()
  }

  useEffect(() => {
    const modelContext = document.modelContext ?? navigator.modelContext
    if (hasEditLink(location.hash)) startEditing()
    else if (modelContext || hasTailoringLink(location.hash)) void load()
  }, [])

  return TailoredResume ? (
    <TailoredResume source={source} editing={editing} />
  ) : (
    <ResumeView resume={source} onStartEdit={startEditing} />
  )
}
