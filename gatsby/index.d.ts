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
