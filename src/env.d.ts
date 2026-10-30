/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly NOTION_TOKEN: string
  readonly NOTION_LINKS_DATABASE_ID: string
}

/** When the site was built, as an ISO 8601 timestamp. Set in astro.config.mjs. */
declare const __BUILD_TIME__: string

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
