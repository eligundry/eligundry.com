import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { renderOgImage } from '../../../lib/ogImage'

type Entry = CollectionEntry<'blog'> | CollectionEntry<'talks'>

export const getStaticPaths = (async () => {
  const entries: Entry[] = [
    ...(await getCollection('blog')),
    ...(await getCollection('talks')),
  ]

  // Posts with a cover use it as their OpenGraph image instead
  return entries
    .filter((entry) => !entry.data.cover)
    .map((entry) => ({
      params: { collection: entry.collection, slug: entry.id },
      props: { entry },
    }))
}) satisfies GetStaticPaths

export const GET: APIRoute<{ entry: Entry }> = async ({ props: { entry } }) => {
  const { title, description, date } = entry.data
  const kicker =
    entry.collection === 'talks'
      ? ['Talk', entry.data.location].filter(Boolean).join(' · ')
      : 'Blog Post'

  const image = await renderOgImage({
    title,
    description,
    kicker,
    date,
    seed: `${entry.collection}/${entry.id}`,
  })

  return new Response(new Uint8Array(image), {
    headers: { 'Content-Type': 'image/png' },
  })
}
