import React from 'react'
import { IconContext } from 'react-icons'
import { FaGithub, FaTwitter, FaEnvelope, FaRssSquare } from 'react-icons/fa'

import config from '../../../data/SiteConfig'

const UserLinks: React.FC = () => {
  const links = [
    {
      label: 'GitHub',
      url: 'https://github.com/eligundry',
      icon: <FaGithub />,
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com/EliGundry',
      icon: <FaTwitter />,
    },
    {
      label: 'Email',
      url: 'mailto:eligundry@gmail.com',
      icon: <FaEnvelope />,
    },
    {
      lable: 'RSS',
      url: config.siteRss,
      icon: <FaRssSquare />,
    },
  ]

  return (
    <IconContext.Provider value={{}}>
      <div className="user-links">
        {links.map(link => (
          <a href={link.url} title={link.label}>
            {link.icon}
          </a>
        ))}
      </div>
    </IconContext.Provider>
  )
}

export default UserLinks
