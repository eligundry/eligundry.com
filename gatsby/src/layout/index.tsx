import React from 'react'
import Helmet from 'react-helmet'
import { IconContext } from 'react-icons'

import BaseStyles from './BaseStyles'
import Header from './Header'
import Footer from './Footer'
import config from '../../data/SiteConfig'

interface Props {
  showHeader?: boolean
  showFooter?: boolean
  children: React.ReactNode[] | React.ReactNode
}

const MainLayout: React.FC<Props> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <IconContext.Provider value={{}}>
      <BaseStyles>
        <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
          <title>{config.siteTitle}</title>
          <meta name="description" content={config.siteDescription} />
          <html lang="en" />
        </Helmet>
        {showHeader && <Header />}
        {children}
        {showFooter && <Footer />}
      </BaseStyles>
    </IconContext.Provider>
  )
}

export default MainLayout
