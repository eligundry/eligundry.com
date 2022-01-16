declare module '*.gif' {
  const url: string
  export default url
}

declare module '*.png' {
  const url: string
  export default url
}

declare module '*.jpg' {
  const url: string
  export default url
}

declare module '*.svg' {
  const url: string
  export default url
}

declare namespace CSS {
  interface Houdini {
    addModule: (url: string) => void
  }

  // This is not defined in Firefox, Safari and IE
  let paintWorklet: Houdini | undefined
}

declare module './src/components/JobSearch/*.json' {
  type StatusEmoji = string | "✅" | "❌" | "🙅‍♂️" | ""

  export interface JobSearchItem {
    Company: string
    Date: string
    "Applied?": StatusEmoji
    "Callback?": StatusEmoji
    "Code Test?": StatusEmoji
    "On Site?": StatusEmoji
    "Offer?": StatusEmoji
  }

  export default JobSearchItem[]
}
