// @adobe/structured-data-validator ships JavaScript without types
declare module '@adobe/structured-data-validator' {
  export interface ValidationIssue {
    issueMessage: string
    severity: 'ERROR' | 'WARNING'
    path?: {
      type?: string
      property?: string
      index?: number
      length?: number
    }[]
    fieldNames?: string[]
    rootType?: string
  }

  type Handler = () => Promise<{ default: unknown }>

  export default class Validator {
    constructor(schemaOrgJson?: unknown)
    debug: boolean
    globalHandlers: Handler[]
    registeredHandlers: Record<string, Handler[]>
    validate(data: unknown): Promise<ValidationIssue[]>
  }
}

// @marbec/web-auto-extractor ships JavaScript without types
declare module '@marbec/web-auto-extractor' {
  export default class WebAutoExtractor {
    constructor(options?: {
      addLocation?: boolean
      embedSource?: boolean | string[]
    })
    parse(html: string): {
      microdata: Record<string, Record<string, unknown>[]>
      rdfa: Record<string, Record<string, unknown>[]>
      jsonld: Record<string, Record<string, unknown>[]>
      errors?: unknown[]
    }
  }
}
