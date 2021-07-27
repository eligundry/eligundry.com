import React from 'react'
import Helmet from 'react-helmet'
import useMeasure from 'react-use/lib/useMeasure'
import useWindowSize from 'react-use/lib/useWindowSize'

import Styles, { ContentWrapper } from './Styles'
import Header from './Header'
import Nav from './Nav'
import Tooltip from '../components/Shared/Tooltip'
import config from '../../data/SiteConfig'
import eliHeadshot from '../../static/img/eli-gundry-headshot.jpg'

const MainLayout: React.FC = ({ children }) => {
  const [ref, { right: headerWidth, x: headerPadding }] = useMeasure()
  const { width: windowWidth } = useWindowSize()
  const navLeftPosition =
    windowWidth - (windowWidth - headerWidth - headerPadding) / 2

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
        <Header ref={ref} />
        <Nav horizontalPositionRelativeToLeft={navLeftPosition} />
        <ContentWrapper>{children}</ContentWrapper>
        <Tooltip />
      </div>
    </>
  )
}

export default MainLayout
