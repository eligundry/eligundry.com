import React from 'react'
import Helmet from 'react-helmet'
import { IconContext } from 'react-icons'

import { ContentWrapper, GlobalStyles } from './styles'
import Header from './Header'
import Footer from './Footer'
import Tooltip from '../components/Shared/Tooltip'
import config from '../../data/SiteConfig'
import eliHeadshot from '../../static/img/eli-gundry-headshot.jpg'

const MainLayout: React.FC = ({ children }) => {
  return (
    <IconContext.Provider value={{}}>
      <GlobalStyles />
      <div itemScope itemType="https://schema.org/Person" itemID="#eli-gundry">
        <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
          <html lang="en" />
          <title>{config.siteTitle}</title>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <meta itemProp="image" content={eliHeadshot} />
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
        <Tooltip />
      </div>
    </IconContext.Provider>
  )
}

export default MainLayout
