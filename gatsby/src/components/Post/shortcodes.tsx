import loadable from '@loadable/component'

const MDXShortcodes = {
  StreamingAlbum: loadable(() => import('../Embeds/Album')),
  GitHubFile: loadable(() => import('../Embeds/GitHubFile')),
  YouTube: loadable(() => import('react-lite-yt-embed'), {
    resolveComponent: ({ LiteYoutubeEmbed }) => LiteYoutubeEmbed,
  }),
}

export default MDXShortcodes
