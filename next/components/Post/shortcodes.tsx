import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { MDXRemoteProps } from 'next-mdx-remote'

const MDXShortcodes: MDXRemoteProps['components'] = {
  img: (props) => <Image {...props} layout="responsive" loading="lazy" />,
  StreamingAlbum: dynamic(() => import('../Embeds/Album')),
  GitHubFile: dynamic(() => import('../Embeds/GitHubFile')),
  YouTube: dynamic(() =>
    import('react-lite-yt-embed').then((mod) => mod.LiteYoutubeEmbed)
  ),
  // JobSearchSankeyChart: dynamic(() =>
  //   import('@/components/JobSearch/SankeyChart').then(
  //     (mod) => mod.JobSearchSankeyChartByYear
  //   )
  // ),
}

export default MDXShortcodes
