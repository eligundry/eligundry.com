import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import config from '../../data/SiteConfig'
import './index.css'

const LayoutWrapper = styled.div`
  font-family: 'Helvetica', sans-serif;
  width: 80%;
`

const MainLayout: React.FC = ({ children }) => {
  return (
    <LayoutWrapper className="layout-container">
      <Helmet titleTemplate={`%s | ${config.siteTitle}`}>
        <meta name="description" content={config.siteDescription} />
        <html lang="en" />
      </Helmet>
      {children}
    </LayoutWrapper>
  )
}

export default MainLayout
