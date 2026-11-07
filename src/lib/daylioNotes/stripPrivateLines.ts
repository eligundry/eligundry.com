/**
 * Drops the lines of a Daylio note tagged #private, or returns null when
 * nothing public is left.
 */
export const stripPrivateLines = (raw: string): string | null => {
  const markdown = raw
    .split('\n')
    .filter((line) => !line.includes('#private'))
    .join('\n')
    .trim()

  return markdown || null
}
