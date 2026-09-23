import { useWebMCP } from 'usewebmcp'
import { resumeTools, type ResumeTool } from './tools'
import type { Tailoring } from './useTailoring'

function Tool({ tool, tailoring }: { tool: ResumeTool; tailoring: Tailoring }) {
  useWebMCP({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    annotations: tool.annotations,
    execute: (input) => tool.execute(input ?? {}, tailoring),
  })
  return null
}

/** Registers the tailoring tools with the browser's WebMCP model context. */
export default function ResumeTools({ tailoring }: { tailoring: Tailoring }) {
  return (
    <>
      {resumeTools.map((tool) => (
        <Tool key={tool.name} tool={tool} tailoring={tailoring} />
      ))}
    </>
  )
}
