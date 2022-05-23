import React from 'react'
import clsx from 'clsx'
import {
  FaGithubSquare,
  FaTwitterSquare,
  FaEnvelopeSquare,
  FaRssSquare,
  FaLinkedin,
  FaLastfmSquare,
} from 'react-icons/fa'
import styles from './index.module.scss'

export const links = Object.freeze([
  {
    name: 'github',
    label: 'Review my code on GitHub',
    url: 'https://github.com/eligundry',
    icon: <FaGithubSquare />,
    itemProp: 'sameAs',
  },
  {
    name: 'twitter',
    label: 'Follow me on Twitter',
    url: 'https://twitter.com/EliGundry',
    icon: <FaTwitterSquare />,
    itemProp: 'sameAs',
  },
  {
    name: 'linkedin',
    label: 'Add me to your professional network on LinkedIn',
    url: 'https://www.linkedin.com/in/eligundry/',
    icon: <FaLinkedin />,
    itemProp: 'sameAs',
  },
  {
    name: 'lastfm',
    label: "See what I'm listening to on Last.fm",
    url: 'https://www.last.fm/user/eli_pwnd',
    icon: <FaLastfmSquare />,
    itemProp: 'sameAs',
  },
  {
    name: 'email',
    label: 'Shoot me an email',
    url: 'mailto:eligundry@gmail.com',
    icon: <FaEnvelopeSquare />,
    itemProp: undefined,
  },
  {
    name: 'rss',
    label: 'Add my blog to your Google Reader via RSS',
    url: '/blog.rss',
    icon: <FaRssSquare />,
    itemProp: undefined,
  },
])

const UserLinks: React.FC = () => (
  <nav className={clsx('user-links', styles.links)}>
    {links.map((link) => (
      <React.Fragment key={link.url}>
        <a
          href={link.url}
          title={link.label}
          target="_blank"
          rel="noopener noreferrer"
          itemProp={link.itemProp}
          className={styles.link}
        >
          {link.icon}
        </a>
        {link.name === 'email' && (
          <meta itemProp="email" content={link.url.replace('mailto:', '')} />
        )}
      </React.Fragment>
    ))}
  </nav>
)

export default UserLinks
