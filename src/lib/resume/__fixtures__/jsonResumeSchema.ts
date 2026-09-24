import type { StandardSchemaV1 } from '@standard-schema/spec'
// @ts-expect-error - untyped CommonJS module
import { validate } from '@jsonresume/schema'
import type { JsonResume } from '../model'

interface SchemaError {
  path: (string | number)[]
  message: string
}

/**
 * The JSON Resume schema as a Standard Schema, for
 * `expect(resume).toEqual(expect.schemaMatching(jsonResumeSchema))`.
 */
export const jsonResumeSchema: StandardSchemaV1<unknown, JsonResume> = {
  '~standard': {
    version: 1,
    vendor: '@jsonresume/schema',
    validate(value) {
      let errors: SchemaError[] | null = null
      validate(value, (err: SchemaError[] | null) => {
        errors = err
      })
      return errors
        ? {
            issues: (errors as SchemaError[]).map(({ path, message }) => ({
              message,
              path,
            })),
          }
        : { value: value as JsonResume }
    },
  },
}
