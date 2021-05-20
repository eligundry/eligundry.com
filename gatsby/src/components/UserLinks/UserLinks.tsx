import React from 'react'
import tw, { styled } from 'twin.macro'
import {
  FaGithubSquare,
  FaTwitterSquare,
  FaEnvelopeSquare,
  FaRssSquare,
  FaLinkedin,
  FaLastfmSquare,
} from 'react-icons/fa'

import config from '../../../data/SiteConfig'

const links = [
  {
    label: 'Review my code on GitHub',
    url: 'https://github.com/eligundry',
    icon: <FaGithubSquare />,
  },
  {
    label: 'Follow me on Twitter',
    url: 'https://twitter.com/EliGundry',
    icon: <FaTwitterSquare />,
  },
  {
    label: 'Add me to your professional network on LinkedIn',
    url: 'https://www.linkedin.com/in/eligundry/',
    icon: <FaLinkedin />,
  },
  {
    label: "See what I'm listening to on Last.fm",
    url: 'https://www.last.fm/user/eli_pwnd',
    icon: <FaLastfmSquare />,
  },
  {
    label: 'Shoot me an email',
    url: 'mailto:eligundry@gmail.com',
    icon: <FaEnvelopeSquare />,
  },
  {
    label: 'Add my blog to your Google Reader via RSS',
    url: config.siteRss,
    icon: <FaRssSquare />,
  },
]

const Links = styled.div`
  ${tw`flex flex-row text-2xl`}

  & > a {
    ${tw`
      hover:text-pink-300
      transition 
      duration-200 
      ease-linear
      transition-colors
    `}
  }
`

const UserLinks: React.FC = () => {
  return (
    <Links className="user-links">
      {links.map(link => (
        <a
          href={link.url}
          title={link.label}
          target="_blank"
          rel="noopener noreferrer"
          key={link.url}
        >
          {link.icon}
        </a>
      ))}
    </Links>
  )
}

export default UserLinks
