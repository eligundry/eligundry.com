import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { IconContext } from 'react-icons'

import Header from './Header'
import Footer from './Footer'
import config from '../../data/SiteConfig'
import style from '../../data/styleConfig'
import './index.css'

const LayoutWrapper = styled.div`
  font-family: ${style.font.family};
  font-size: ${style.font.size};
  width: 60%;
  margin: 0 auto;

  @media (${style.breakPoints.desktopSmall}) {
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
    <IconContext.Provider value={{}}>
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
    </IconContext.Provider>
  )
}

export default MainLayout
