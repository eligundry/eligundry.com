/* eslint-disable import/prefer-default-export, react/jsx-no-constructed-context-values */
import React from 'react'
import { GatsbyBrowser } from 'gatsby'
import { IconContext } from 'react-icons'

import ThemeModeProvider from './src/layout/ThemeModeProvider'

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => (
  <ThemeModeProvider>
    <IconContext.Provider value={{}}>{element}</IconContext.Provider>
  </ThemeModeProvider>
)
