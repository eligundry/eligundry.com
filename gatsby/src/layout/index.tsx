import React from 'react'
import Helmet from 'react-helmet'

import Styles, { ContentWrapper } from './Styles'
import Header from './Header'
import Nav from './Nav'
import Tooltip from '../components/Shared/Tooltip'
import config from '../../data/SiteConfig'
import eliHeadshot from '../../static/img/eli-gundry-headshot.jpg'

const MainLayout: React.FC = ({ children }) => {
  return (
    <>
      <Styles />
      <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
        <html lang="en" />
        <title>{config.siteTitle}</title>
        <meta name="description" content={config.siteDescription} />
      </Helmet>
      <div itemScope itemType="https://schema.org/Person" itemID="#eli-gundry">
        <meta itemProp="image" content={eliHeadshot} />
        <Header />
        <Nav />
        <ContentWrapper>{children}</ContentWrapper>
        <Tooltip />
      </div>
    </>
  )
}

export default MainLayout
