import React from 'react'

import Tooltip from '@/components/Shared/Tooltip'
import ContentWrapper from './ContentWrapper'
import Head from './Head'
import Header from './Header'
import Footer from './Footer'
import FancyBackground from './FancyBackground'
import ThemeModeProvider from './ThemeModeProvider'

interface Props {
  hideHeader?: boolean
}

const MainLayout: React.FC<Props> = ({ children, hideHeader = false }) => (
  <ThemeModeProvider>
    <Head />
    {!hideHeader && <Header />}
    <ContentWrapper>{children}</ContentWrapper>
    <Footer />
    <Tooltip />
    <FancyBackground />
  </ThemeModeProvider>
)

export default MainLayout
