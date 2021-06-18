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

declare module 'url-join' {
  const urljoin: (...paths: string[]) => string
  export default urljoin
}
