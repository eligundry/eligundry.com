import React from 'react'

import Tooltip from '@/components/Shared/Tooltip'
import useHideHeader from '@/hooks/useHideHeader'
import ContentWrapper from './ContentWrapper'
import Head from './Head'
import Header from './Header'
import Footer from './Footer'
import FancyBackground from './FancyBackground'
import ThemeModeProvider from './ThemeModeProvider'

const MainLayout: React.FC = ({ children }) => {
  const hideHeader = useHideHeader()

  return (
    <ThemeModeProvider>
      <Head />
      {!hideHeader && <Header />}
      <ContentWrapper>{children}</ContentWrapper>
      <Footer />
      <Tooltip />
      <FancyBackground />
    </ThemeModeProvider>
  )
}

export default MainLayout
