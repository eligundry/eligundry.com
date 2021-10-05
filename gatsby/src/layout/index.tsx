import React from 'react'
import Helmet from 'react-helmet'
import { IconContext } from 'react-icons'

import { ContentWrapper, GlobalStyles } from './styles'
import Header from './Header'
import Footer from './Footer'
import Tooltip from '../components/Shared/Tooltip'
import config from '../../data/SiteConfig'
import eliHeadshot from '../../static/img/eli-gundry-headshot.jpg'

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
      <GlobalStyles />
      <div itemScope itemType="https://schema.org/Person" itemID="#eli-gundry">
        <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
          <html lang="en" />
          <title>{config.siteTitle}</title>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <meta itemProp="image" content={eliHeadshot} />
        {showHeader && <Header />}
        <ContentWrapper wider={wider}>{children}</ContentWrapper>
        <Footer />
        <Tooltip />
      </div>
    </IconContext.Provider>
  )
}

export default MainLayout
