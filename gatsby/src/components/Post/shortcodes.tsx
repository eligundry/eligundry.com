import loadable from '@loadable/component'

const MDXShortcodes = {
  StreamingAlbum: loadable(() => import('../Embeds/Album')),
  GitHubFile: loadable(() => import('../Embeds/GitHubFile')),
  YouTube: loadable(() => import('react-lite-yt-embed'), {
    resolveComponent: ({ LiteYoutubeEmbed }) => LiteYoutubeEmbed,
  }),
  JobSearchSankeyChart: loadable(() => import('../JobSearch/SankeyChart'), {
    resolveComponent: ({ JobSearchSankeyChartByYear }) =>
      JobSearchSankeyChartByYear,
  }),
}

export default MDXShortcodes
