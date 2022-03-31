import dynamic from 'next/dynamic'
import type { MDXRemoteProps } from 'next-mdx-remote'

import MdxNextImage from '@/components/Embeds/MdxNextImage'

const MDXShortcodes: MDXRemoteProps['components'] = {
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

export const MDXShortcodesForFeed: MDXRemoteProps['components'] = {
  // @ts-ignore
  JobSearchSankeyChart: (props) => null,
  // @ts-ignore
  Tweet: dynamic(() => import('@/components/Embeds/Tweet')),
  // @ts-ignore
  GitHubFile: (props) => null,
  // @ts-ignore
  YouTube: (props) => null,
  // @ts-ignore
  StreamingAlbum: (props) => null,
}

export default MDXShortcodes
