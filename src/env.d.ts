/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client-image" />

interface ImportMetaEnv {
  readonly NOTION_TOKEN: string
  readonly NOTION_LINKS_DATABASE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace CSS {
  interface Houdini {
    addModule: (url: string) => void
  }

  // This is not defined in Firefox, Safari and IE
  let paintWorklet: Houdini | undefined
}

declare module '*.png' {
  export default string
}

declare module '*.svg' {
  export default string
}

declare namespace astroHTML.JSX {
  interface ScriptHTMLAttributes {
    repo?: string
    'issue-term'?: string
    label?: string
    theme?: string
  }
}

// WebMCP (https://github.com/webmachinelearning/webmcp). Only in browsers or
// extensions that support it, so everything is optional.
interface ModelContextTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: {
    readOnlyHint?: boolean
    destructiveHint?: boolean
  }
  execute: (input: any, client?: unknown) => Promise<unknown>
}

interface ModelContext {
  registerTool?: (tool: ModelContextTool) => unknown
  unregisterTool?: (name: string) => void
  provideContext?: (context: { tools: ModelContextTool[] }) => void
  clearContext?: () => void
}

interface Navigator {
  readonly modelContext?: ModelContext
}
