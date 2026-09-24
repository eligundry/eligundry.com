import { getCollection, type CollectionEntry } from 'astro:content'

/**
 * Astro stores content collections sorted by entry ID, so `getCollection`
 * doesn't return entries in the order their loader produced them. Loaders whose
 * order matters record it in an `order` field for consumers to sort by.
 */
export const byOrder = <T extends { data: { order: number } }>(a: T, b: T) =>
  a.data.order - b.data.order

/** Adds each item's position in the source to it as `order`. */
export const withOrder = <T extends object>(items: T[]) =>
  items.map((item, order) => ({ ...item, order }))

/** Daylio entries, newest first. */
export async function getFeelings(): Promise<CollectionEntry<'feelings'>[]> {
  return (await getCollection('feelings')).sort(
    (a, b) => b.data.time.getTime() - a.data.time.getTime()
  )
}
