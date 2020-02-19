import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import Header from './Header'
import Footer from './Footer'
import config from '../../data/SiteConfig'
import styleConfig from '../../data/styleConfig'
import './index.css'

const LayoutWrapper = styled.div`
  font-family: ${styleConfig.font.family};
  font-size: ${styleConfig.font.size};
  width: 80%;
  margin: 0 auto;

  @media (${styleConfig.breakPoints.mobile}) {
    width: 90%;
  }

  & img {
    max-width: 100%;
  }
`

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
    <LayoutWrapper className="layout-container">
      <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
        <title>{config.siteTitle}</title>
        <meta name="description" content={config.siteDescription} />
        <html lang="en" />
      </Helmet>
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </LayoutWrapper>
  )
}

export default MainLayout
