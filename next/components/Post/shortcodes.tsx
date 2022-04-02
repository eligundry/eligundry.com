import dynamic from 'next/dynamic'
import type { MDXComponents } from 'mdx/types'

import MdxNextImage from '@/components/Embeds/MdxNextImage'

const MDXShortcodes: MDXComponents = {
  img: (props) => (
    // @ts-ignore
    <MdxNextImage {...props} layout="responsive" loading="lazy" />
  ),
  // @ts-ignore
  StreamingAlbum: dynamic(() => import('@/components/Embeds/Album')),
  // @ts-ignore
  Tweet: dynamic(() =>
    import('@/components/Embeds/Tweet').then((mod) => mod.LazyLoadTweet)
  ),
  // @ts-ignore
  GitHubFile: dynamic(() => import('@/components/Embeds/GitHubFile')),
  // @ts-ignore
  YouTube: dynamic(() =>
    import('react-lite-yt-embed').then((mod) => mod.LiteYoutubeEmbed)
  ),
  // @ts-ignore
  JobSearchSankeyChart: dynamic(() =>
    import('@/components/JobSearch/SankeyChart').then(
      (mod) => mod.JobSearchSankeyChartByYear
    )
  ),
}

export const MDXShortcodesForFeed: MDXComponents = {
  // @ts-ignore
  JobSearchSankeyChart: () => null,
  // @ts-ignore
  Tweet: dynamic(() => import('@/components/Embeds/Tweet')),
  // @ts-ignore
  GitHubFile: () => null,
  // @ts-ignore
  YouTube: () => null,
  // @ts-ignore
  StreamingAlbum: () => null,
}

export default MDXShortcodes