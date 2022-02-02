/* eslint-disable import/prefer-default-export, react/jsx-no-constructed-context-values */
import React from 'react'
import { GatsbySSR } from 'gatsby'
import { IconContext } from 'react-icons'

import ThemeModeProvider from '../src/layout/ThemeModeProvider'

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => (
  <ThemeModeProvider>
    <IconContext.Provider value={{}}>{element}</IconContext.Provider>
  </ThemeModeProvider>
)
