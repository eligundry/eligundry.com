/* eslint-disable jsx-a11y/iframe-has-title, @typescript-eslint/no-unused-vars, @next/next/no-img-element, jsx-a11y/alt-text */
import dynamic from 'next/dynamic'
import type { MDXComponents } from 'mdx/types'

import MdxNextImage from '@/components/Embeds/MdxNextImage'
import ResponsiveIFrame from '@/components/Embeds/ResponsiveIFrame'
import DemoVideo from '@/components/Embeds/DemoVideo'

const MDXShortcodes: MDXComponents = {
  img: (props) => (
    // @ts-ignore
    <MdxNextImage {...props} layout="responsive" loading="lazy" />
  ),
  ResponsiveIFrame: (props) => <ResponsiveIFrame {...props} />,
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
  DemoVideo: (props) => <DemoVideo {...props} />,
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
  ResponsiveIFrame: (props) => <iframe {...props} />,
  // @ts-ignore
  img: ({ blurDataURL, ...props }) => <img {...props} />,
  // @ts-ignore
  DemoVideo: () => null,
}

export default MDXShortcodes
