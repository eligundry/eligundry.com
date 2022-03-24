import React from 'react'

import { ContentWrapper, GlobalStyles } from './styles'
import Head from './Head'
import Header from './Header'
import Footer from './Footer'
import Tooltip from '../Shared/Tooltip'
import FancyBackground from './FancyBackground'
// import config from '../../data/SiteConfig'
// import eliHeadshot from '../../static/img/eli-gundry-headshot.jpg'

interface Props {
  hideHeader?: boolean
}

const MainLayout: React.FC<Props> = ({ children, hideHeader = false }) => (
  <>
    <Head />
    <GlobalStyles />
    {!hideHeader && <Header />}
    <ContentWrapper>{children}</ContentWrapper>
    <Footer />
    <Tooltip />
    <FancyBackground />
  </>
)

export default MainLayout
