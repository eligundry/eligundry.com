/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

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
