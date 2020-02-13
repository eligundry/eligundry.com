import React from 'react'
import { Link } from 'gatsby'

import config from '../../data/SiteConfig'
import UserLinks from '../components/UserLinks/UserLinks'

const Footer: React.FC = () => {
  const url = config.siteRss
  const { copyright } = config
  if (!copyright) {
    return null
  }
  return (
    <footer className="footer">
      <UserLinks config={config} labeled />
      <div className="notice-container">
        <Link to={url}>
          <button>Subscribe</button>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
