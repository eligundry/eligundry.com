import React from 'react'
import { styled, css } from 'twin.macro'

interface Props
  extends Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'src'> {
  youtubeID: string
}

const YouTubeEmbed: React.FC<Props> = ({ youtubeID, ...props }) => (
  <YouTubeEmbedIframe
    src={`https://www.youtube.com/embed/${youtubeID}`}
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    {...props}
  />
)

const YouTubeEmbedIframe = styled.iframe``

export default YouTubeEmbed
