import React from 'react'
import { IconContext } from 'react-icons'

import ThemeModeProvider from './src/layout/ThemeModeProvider'

/**
 * @type {import('gatsby').GatsbyBrowser['wrapRootElement']}
 */
export const wrapRootElement = ({ element }) => (
  <ThemeModeProvider>
    <IconContext.Provider value={{}}>{element}</IconContext.Provider>
  </ThemeModeProvider>
)
