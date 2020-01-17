import React from 'react'
import Helmet from 'react-helmet'
import config from '../../data/SiteConfig'
import './index.css'

const MainLayout: React.FC = ({ children }) => {
  return (
    <div className="layout-container">
      <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
        <meta name="description" content={config.siteDescription} />
        <html lang="en" />
      </Helmet>
      {children}
    </div>
  )
}

export default MainLayout
