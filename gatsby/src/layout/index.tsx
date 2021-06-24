import React from 'react'
import Helmet from 'react-helmet'
import { IconContext } from 'react-icons'

import BaseStyles, { ContentWrapper } from './BaseStyles'
import Header from './Header'
import Nav from './Nav'
import Tooltip from '../components/Shared/Tooltip'
import config from '../../data/SiteConfig'

interface Props {
  showHeader?: boolean
  showFooter?: boolean
  children: React.ReactNode[] | React.ReactNode
  wider?: boolean
}

const MainLayout: React.FC<Props> = ({
  children,
  showHeader = true,
  wider = false,
}) => {
  return (
    <IconContext.Provider value={{}}>
      <BaseStyles
        itemScope
        itemType="https://schema.org/Person"
        itemID="#eli-gundry"
      >
        <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
          <title>{config.siteTitle}</title>
          <meta name="description" content={config.siteDescription} />
          <html lang="en" />
        </Helmet>
        {showHeader && <Header />}
        <Nav wider={wider} />
        <ContentWrapper wider={wider}>{children}</ContentWrapper>
        <Tooltip />
      </BaseStyles>
    </IconContext.Provider>
  )
}

export default MainLayout
